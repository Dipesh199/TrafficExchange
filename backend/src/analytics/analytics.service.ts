import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteStat } from '../websites/entities/website-stat.entity';
import { CreditTransaction, TransactionType } from '../billing/entities/credit-transaction.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(WebsiteStat)
        private websiteStatRepo: Repository<WebsiteStat>,
        @InjectRepository(CreditTransaction)
        private creditTxRepo: Repository<CreditTransaction>,
        @InjectRepository(Campaign)
        private campaignRepo: Repository<Campaign>,
    ) { }

    async getUserDashboardStats(userId: string) {
        // 1. Total websites tracking stats (placeholder for deep aggregation)
        // Instead of deep WebsiteStat query, we can just return active campaigns visits

        const activeCampaigns = await this.campaignRepo.find({
            where: { user: { id: userId } }
        });

        const totalVisitsReceived = activeCampaigns.reduce((sum, c) => sum + c.visitsDelivered, 0);

        // 2. Total credits earned vs spent in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentTransactions = await this.creditTxRepo.createQueryBuilder('tx')
            .where('tx.user_id = :userId', { userId })
            .andWhere('tx.created_at >= :date', { date: thirtyDaysAgo })
            .getMany();

        const creditsEarned = recentTransactions
            .filter(tx => tx.type === TransactionType.EARN)
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const creditsSpent = recentTransactions
            .filter(tx => tx.type === TransactionType.SPEND)
            .reduce((sum, tx) => sum + Number(tx.amount), 0);

        return {
            totalVisitsReceived,
            creditsEarned30d: creditsEarned,
            creditsSpent30d: creditsSpent,
            activeCampaignsCount: activeCampaigns.filter(c => c.status === 'active').length
        };
    }
}
