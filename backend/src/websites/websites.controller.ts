import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('websites')
@UseGuards(JwtAuthGuard)
export class WebsitesController {
    constructor(private readonly websitesService: WebsitesService) { }

    @Post()
    create(@Request() req: any, @Body() createWebsiteDto: CreateWebsiteDto) {
        // req.user contains { userId, username, role } populated by JwtStrategy
        return this.websitesService.create(req.user.userId, createWebsiteDto);
    }

    @Get()
    findAllForUser(@Request() req: any) {
        return this.websitesService.findAllForUser(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req: any, @Param('id') id: string) {
        return this.websitesService.findOne(id, req.user.userId);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.websitesService.remove(id, req.user.userId);
    }
}
