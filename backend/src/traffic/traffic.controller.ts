import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VerifySessionDto } from './dto/verify-session.dto';

@UseGuards(JwtAuthGuard)
@Controller('traffic')
export class TrafficController {
    constructor(private readonly trafficService: TrafficService) { }

    @Get('surf')
    async getWebsiteToSurf(@Req() req: any) {
        // req.user contains the authenticated user
        return this.trafficService.findWebsiteForUser(req.user.id, req.ip, req.headers['user-agent']);
    }

    @Post('verify')
    async verifySession(@Req() req: any, @Body() verifySessionDto: VerifySessionDto) {
        return this.trafficService.verifySessionAndAwardCredit(req.user.id, verifySessionDto);
    }
}
