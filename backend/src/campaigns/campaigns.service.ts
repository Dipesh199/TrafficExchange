import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Campaign, CampaignStatus } from './entities/campaign.entity';
import { CampaignTarget, DeviceType } from './entities/campaign-target.entity';
import { Website, WebsiteStatus } from '../websites/entities/website.entity';
import { User } from '../users/entities/user.entity';
import { CreditTransaction, TransactionType } from '../billing/entities/credit-transaction.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignsService {
    // 1 credit = 1 visit for simplicity right now
    private readonly COST_PER_VISIT = 1;

    constructor(
        @InjectRepository(Campaign)
        private campaignRepo: Repository<Campaign>,
        @InjectRepository(CampaignTarget)
        private campaignTargetRepo: Repository<CampaignTarget>,
        @InjectRepository(Website)
        private websiteRepo: Repository<Website>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(CreditTransaction)
        private creditTxRepo: Repository<CreditTransaction>,
        private dataSource: DataSource
    ) { }

    async create(userId: string, dto: CreateCampaignDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Verify user has enough credits
            const user = await queryRunner.manager.findOne(User, {
                where: { id: userId },
                lock: { mode: 'pessimistic_write' }
            });

            if (!user) throw new NotFoundException('User not found');

            const totalCost = dto.totalVisitsOrdered * this.COST_PER_VISIT;
            if (user.credits < totalCost) {
                throw new BadRequestException('Insufficient credits to create this campaign.');
            }

            // 2. Verify website belongs to user and is verified
            const website = await queryRunner.manager.findOne(Website, {
                where: { id: dto.websiteId, user: { id: userId } }
            });

            if (!website) {
                throw new NotFoundException('Website not found or does not belong to you.');
            }
            // Real system: verify website.status === WebsiteStatus.ACTIVE

            // 3. Deduct Credits
            user.credits = Number(user.credits) - totalCost;
            await queryRunner.manager.save(user);

            // 4. Create Transaction Log
            const tx = queryRunner.manager.create(CreditTransaction, {
                user: { id: userId },
                amount: totalCost,
                type: TransactionType.SPEND,
                referenceId: website.id // Can be website or campaign ID once created
            });
            await queryRunner.manager.save(tx);

            // 5. Create Campaign
            const campaign = queryRunner.manager.create(Campaign, {
                user: { id: userId },
                website: website,
                totalVisitsOrdered: dto.totalVisitsOrdered,
                visitsDelivered: 0,
                status: CampaignStatus.ACTIVE
            });
            const savedCampaign = await queryRunner.manager.save(campaign);

            // Update tx reference ID
            tx.referenceId = savedCampaign.id;
            await queryRunner.manager.save(tx);

            // 6. Create Campaign Target logic
            if (dto.country || dto.deviceType) {
                const target = queryRunner.manager.create(CampaignTarget, {
                    campaign: savedCampaign,
                    country: dto.country,
                    deviceType: dto.deviceType || DeviceType.ALL
                });
                await queryRunner.manager.save(target);
            }

            await queryRunner.commitTransaction();

            return savedCampaign;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllForUser(userId: string) {
        return this.campaignRepo.find({
            where: { user: { id: userId } },
            relations: ['website'],
            order: { createdAt: 'DESC' }
        });
    }

    async pauseCampaign(userId: string, campaignId: string) {
        const campaign = await this.campaignRepo.findOne({
            where: { id: campaignId, user: { id: userId } }
        });

        if (!campaign) throw new NotFoundException('Campaign not found');
        if (campaign.status === CampaignStatus.COMPLETED) {
            throw new BadRequestException('Cannot pause a completed campaign.');
        }

        campaign.status = CampaignStatus.PAUSED;
        return this.campaignRepo.save(campaign);
    }

    async resumeCampaign(userId: string, campaignId: string) {
        const campaign = await this.campaignRepo.findOne({
            where: { id: campaignId, user: { id: userId } }
        });

        if (!campaign) throw new NotFoundException('Campaign not found');
        if (campaign.status === CampaignStatus.COMPLETED) {
            throw new BadRequestException('Cannot resume a completed campaign.');
        }

        campaign.status = CampaignStatus.ACTIVE;
        return this.campaignRepo.save(campaign);
    }
}
