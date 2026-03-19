import { Controller, Get, Patch, Param, UseGuards, Req, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Patch('users/:id/suspend')
    async suspendUser(@Req() req: any, @Param('id') userId: string) {
        return this.adminService.suspendUser(req.user.id, userId);
    }

    @Get('websites/pending')
    async getPendingWebsites() {
        return this.adminService.getPendingWebsites();
    }

    @Patch('websites/:id/approve')
    async approveWebsite(@Req() req: any, @Param('id') websiteId: string) {
        return this.adminService.approveWebsite(req.user.id, websiteId);
    }

    @Patch('websites/:id/reject')
    async rejectWebsite(@Req() req: any, @Param('id') websiteId: string) {
        return this.adminService.rejectWebsite(req.user.id, websiteId);
    }

    @Get('fraud-flags')
    async getFraudFlags() {
        return this.adminService.getFraudFlags();
    }
}
