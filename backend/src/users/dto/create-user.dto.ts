import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MaxLength(50)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    passwordHash: string;
}
