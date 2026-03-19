import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficController } from './traffic.controller';
import { TrafficService } from './traffic.service';
import { TrafficSession } from './entities/traffic-session.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { User } from '../users/entities/user.entity';
import { CreditTransaction } from '../billing/entities/credit-transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TrafficSession, Campaign, User, CreditTransaction])],
    controllers: [TrafficController],
    providers: [TrafficService],
})
export class TrafficModule { }
