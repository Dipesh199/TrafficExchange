import { IsString, IsNotEmpty } from 'class-validator';

export class VerifySessionDto {
    @IsString()
    @IsNotEmpty()
    sessionId: string;

    // A token or anti-bot challenge response if needed later
    @IsString()
    token: string;
}
