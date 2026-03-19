import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Website } from '../websites/entities/website.entity';
import { AdminLog } from './entities/admin-log.entity';
import { FraudFlag } from '../traffic/entities/fraud-flag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Website, AdminLog, FraudFlag])],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
