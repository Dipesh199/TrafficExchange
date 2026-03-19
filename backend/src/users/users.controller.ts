import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

class UpdateProfileDto {
    @IsOptional() @IsString() @MaxLength(50)
    username?: string;

    @IsOptional() @IsString() @MinLength(8)
    password?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    async getMe(@Req() req: any) {
        const user = await this.usersService.findById(req.user.id);
        if (!user) return null;
        const { passwordHash, ...safe } = user as any;
        return safe;
    }

    @Patch('me')
    async updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.id, dto);
    }
}
