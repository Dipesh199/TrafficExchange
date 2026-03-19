import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Website } from './entities/website.entity';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class WebsitesService {
    constructor(
        @InjectRepository(Website)
        private websitesRepository: Repository<Website>,
        private usersService: UsersService,
    ) { }

    async create(userId: string, createWebsiteDto: CreateWebsiteDto): Promise<Website> {
        const user = await this.usersService.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const website = this.websitesRepository.create({
            ...createWebsiteDto,
            user,
        });
        return this.websitesRepository.save(website);
    }

    async findAllForUser(userId: string): Promise<Website[]> {
        return this.websitesRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Website> {
        const website = await this.websitesRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!website) throw new NotFoundException('Website not found');
        return website;
    }

    async updateStatus(id: string, status: any): Promise<Website> {
        const website = await this.websitesRepository.findOne({ where: { id } });
        if (!website) throw new NotFoundException('Website not found');

        website.status = status;
        return this.websitesRepository.save(website);
    }

    async remove(id: string, userId: string): Promise<void> {
        const website = await this.findOne(id, userId);
        await this.websitesRepository.remove(website);
    }
}
