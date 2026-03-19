import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan } from 'typeorm';
import { TrafficSession, TrafficSessionStatus } from './entities/traffic-session.entity';
import { Campaign, CampaignStatus } from '../campaigns/entities/campaign.entity';
import { User } from '../users/entities/user.entity';
import { CreditTransaction, TransactionType } from '../billing/entities/credit-transaction.entity';
import { VerifySessionDto } from './dto/verify-session.dto';

@Injectable()
export class TrafficService {
    constructor(
        @InjectRepository(TrafficSession)
        private trafficSessionRepo: Repository<TrafficSession>,
        @InjectRepository(Campaign)
        private campaignRepo: Repository<Campaign>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(CreditTransaction)
        private creditTxRepo: Repository<CreditTransaction>,
        private dataSource: DataSource,
    ) { }

    async findWebsiteForUser(userId: string, ipAddress: string, userAgent: string) {
        // Find an active campaign
        const campaign = await this.campaignRepo.createQueryBuilder('campaign')
            .leftJoinAndSelect('campaign.website', 'website')
            .where('campaign.status = :status', { status: CampaignStatus.ACTIVE })
            .andWhere('campaign.visitsDelivered < campaign.totalVisitsOrdered')
            .andWhere('campaign.user != :userId', { userId })
            .andWhere(`NOT EXISTS (
                SELECT 1 FROM traffic_sessions ts 
                WHERE ts.website_id = campaign.website_id 
                  AND ts.user_id = :userId 
                  AND ts.created_at > NOW() - INTERVAL '1 day'
            )`)
            .orderBy('RANDOM()')
            .getOne();

        if (!campaign) {
            throw new NotFoundException('No active websites available for surfing at the moment.');
        }

        // Create a pending traffic session
        const session = this.trafficSessionRepo.create({
            user: { id: userId },
            website: campaign.website,
            ipAddress,
            userAgent,
            duration: 15, // E.g., 15 seconds required
            status: TrafficSessionStatus.PENDING,
        });

        await this.trafficSessionRepo.save(session);

        return {
            sessionId: session.id,
            url: campaign.website.url,
            duration: session.duration,
            campaignId: campaign.id // Pass back to frontend so we can verify if needed, or we just verify session
        };
    }

    async verifySessionAndAwardCredit(userId: string, dto: VerifySessionDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const session = await queryRunner.manager.findOne(TrafficSession, {
                where: { id: dto.sessionId, user: { id: userId }, status: TrafficSessionStatus.PENDING },
                relations: ['website']
            });

            if (!session) {
                throw new BadRequestException('Invalid or expired surfing session.');
            }

            // In a real app, verify time elapsed against created_at + duration
            const now = new Date();
            const elapsed = (now.getTime() - session.createdAt.getTime()) / 1000;
            if (elapsed < session.duration) {
                // To prevent abuse, throw if they verify too fast. 
                // We'll allow a tiny buffer of 2 secs just in case
                if (session.duration - elapsed > 2) {
                    throw new BadRequestException('You did not view the site long enough!');
                }
            }

            session.status = TrafficSessionStatus.VERIFIED;
            session.verifiedAt = now;
            await queryRunner.manager.save(session);

            // Find an active campaign for this website to increment
            const campaign = await queryRunner.manager.findOne(Campaign, {
                where: { website: { id: session.website.id }, status: CampaignStatus.ACTIVE },
                lock: { mode: 'pessimistic_write' } // Prevent race conditions reading/writing delivered count
            });

            if (campaign) {
                campaign.visitsDelivered += 1;
                if (campaign.visitsDelivered >= campaign.totalVisitsOrdered) {
                    campaign.status = CampaignStatus.COMPLETED;
                }
                await queryRunner.manager.save(campaign);
            }

            // Award credit to user
            const user = await queryRunner.manager.findOne(User, {
                where: { id: userId },
                lock: { mode: 'pessimistic_write' }
            });

            if (!user) {
                throw new BadRequestException('User not found');
            }

            const earnedCredits = Number(user.earnRate); // Use user's specific earn rate
            user.credits = Number(user.credits) + earnedCredits;
            await queryRunner.manager.save(user);

            // Log tx
            const tx = queryRunner.manager.create(CreditTransaction, {
                user: { id: userId },
                amount: earnedCredits,
                type: TransactionType.EARN,
                referenceId: session.id
            });
            await queryRunner.manager.save(tx);

            await queryRunner.commitTransaction();

            return {
                success: true,
                creditsEarned: earnedCredits,
                newBalance: user.credits
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
