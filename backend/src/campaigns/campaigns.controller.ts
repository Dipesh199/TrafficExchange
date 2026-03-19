import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
    constructor(private readonly campaignsService: CampaignsService) { }

    @Post()
    create(@Req() req: any, @Body() createCampaignDto: CreateCampaignDto) {
        return this.campaignsService.create(req.user.id, createCampaignDto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.campaignsService.findAllForUser(req.user.id);
    }

    @Patch(':id/pause')
    pause(@Req() req: any, @Param('id') id: string) {
        return this.campaignsService.pauseCampaign(req.user.id, id);
    }

    @Patch(':id/resume')
    resume(@Req() req: any, @Param('id') id: string) {
        return this.campaignsService.resumeCampaign(req.user.id, id);
    }
}
