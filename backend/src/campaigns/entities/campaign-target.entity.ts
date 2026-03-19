import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

export enum DeviceType {
    ALL = 'all',
    DESKTOP = 'desktop',
    MOBILE = 'mobile',
}

@Entity('campaign_targets')
export class CampaignTarget {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Campaign, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'campaign_id' })
    campaign: Campaign;

    @Column({ length: 2, nullable: true }) // ISO Alpha-2 country code
    country: string;

    @Column({
        type: 'enum',
        enum: DeviceType,
        default: DeviceType.ALL,
    })
    deviceType: DeviceType;
}
