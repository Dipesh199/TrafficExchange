import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { CampaignTarget } from './entities/campaign-target.entity';
import { Website } from '../websites/entities/website.entity';
import { User } from '../users/entities/user.entity';
import { CreditTransaction } from '../billing/entities/credit-transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Campaign, CampaignTarget, Website, User, CreditTransaction])],
    controllers: [CampaignsController],
    providers: [CampaignsService],
})
export class CampaignsModule { }
