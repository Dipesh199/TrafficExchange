import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { WebsiteStat } from '../websites/entities/website-stat.entity';
import { CreditTransaction } from '../billing/entities/credit-transaction.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WebsiteStat, CreditTransaction, Campaign])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsModule { }
