import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(registerDto.password, salt);

        const user = await this.usersService.create({
            username: registerDto.username,
            email: registerDto.email,
            passwordHash,
        });

        // Return tokens so the frontend can auto-login after registration
        return this.generateTokens(user.id, user.username, user.role);
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.status !== 'active') {
            throw new UnauthorizedException('Account is suspended or banned');
        }

        return this.generateTokens(user.id, user.username, user.role);
    }

    private async generateTokens(userId: string, username: string, role: string) {
        const payload = { sub: userId, username, role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            refreshToken: await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'super-secret-jwt-refresh-key-2026',
                expiresIn: '7d',
            }),
            user: { id: userId, username, role },
        };
    }
}
