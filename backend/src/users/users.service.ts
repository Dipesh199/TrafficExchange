import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingEmail = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        if (existingEmail) throw new ConflictException('Email already in use');
        const existingUsername = await this.usersRepository.findOne({ where: { username: createUserDto.username } });
        if (existingUsername) throw new ConflictException('Username already taken');
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async updateProfile(id: string, dto: { username?: string; password?: string }): Promise<Omit<User, 'passwordHash'>> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        if (dto.username && dto.username !== user.username) {
            const existing = await this.usersRepository.findOne({ where: { username: dto.username } });
            if (existing) throw new ConflictException('Username already taken');
            user.username = dto.username;
        }

        if (dto.password) {
            user.passwordHash = await bcrypt.hash(dto.password, 10);
        }

        const saved = await this.usersRepository.save(user);
        const { passwordHash, ...safe } = saved as any;
        return safe;
    }
}
