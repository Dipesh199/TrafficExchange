import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { DeviceType } from '../entities/campaign-target.entity';

export class CreateCampaignDto {
    @IsNotEmpty()
    @IsString()
    websiteId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    totalVisitsOrdered: number;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsEnum(DeviceType)
    deviceType?: DeviceType;
}
