import { IsUrl, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateWebsiteDto {
    @IsUrl({ require_protocol: true, require_tld: false })
    @IsNotEmpty()
    url: string;

    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @IsOptional()
    @MaxLength(50)
    category?: string;

    @IsOptional()
    @IsBoolean()
    targetingDesktop?: boolean;

    @IsOptional()
    @IsBoolean()
    targetingMobile?: boolean;
}
