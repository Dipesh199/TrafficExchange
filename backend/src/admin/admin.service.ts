import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { Website, WebsiteStatus } from '../websites/entities/website.entity';
import { AdminLog } from './entities/admin-log.entity';
import { FraudFlag } from '../traffic/entities/fraud-flag.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Website)
        private websiteRepo: Repository<Website>,
        @InjectRepository(AdminLog)
        private adminLogRepo: Repository<AdminLog>,
        @InjectRepository(FraudFlag)
        private fraudFlagRepo: Repository<FraudFlag>,
    ) { }

    async getAllUsers() {
        return this.userRepo.find({ order: { createdAt: 'DESC' } });
    }

    async suspendUser(adminId: string, targetUserId: string) {
        const user = await this.userRepo.findOne({ where: { id: targetUserId } });
        if (!user) throw new NotFoundException('User not found');

        user.status = UserStatus.SUSPENDED;
        await this.userRepo.save(user);

        await this.logAction(adminId, 'Suspend User', 'User', user.id, {});
        return user;
    }

    async getPendingWebsites() {
        return this.websiteRepo.find({
            where: { status: WebsiteStatus.PENDING },
            relations: ['user']
        });
    }

    async approveWebsite(adminId: string, websiteId: string) {
        const site = await this.websiteRepo.findOne({ where: { id: websiteId } });
        if (!site) throw new NotFoundException('Website not found');

        site.status = WebsiteStatus.ACTIVE;
        await this.websiteRepo.save(site);
        await this.logAction(adminId, 'Approve Website', 'Website', site.id, {});
        return site;
    }

    async rejectWebsite(adminId: string, websiteId: string) {
        const site = await this.websiteRepo.findOne({ where: { id: websiteId } });
        if (!site) throw new NotFoundException('Website not found');

        site.status = WebsiteStatus.REJECTED;
        await this.websiteRepo.save(site);
        await this.logAction(adminId, 'Reject Website', 'Website', site.id, {});
        return site;
    }

    async getFraudFlags() {
        return this.fraudFlagRepo.find({
            relations: ['user', 'website'],
            order: { createdAt: 'DESC' }
        });
    }

    private async logAction(adminId: string, action: string, targetType: string, targetId: string, details: any) {
        const log = this.adminLogRepo.create({
            admin: { id: adminId },
            action,
            targetType,
            targetId,
            details
        });
        await this.adminLogRepo.save(log);
    }
}
