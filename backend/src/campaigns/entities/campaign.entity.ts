import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Website } from '../../websites/entities/website.entity';

export enum CampaignStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
}

@Entity('campaigns')
export class Campaign {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Website, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'website_id' })
    website: Website;

    @Column({ name: 'total_visits_ordered', type: 'int', default: 0 })
    totalVisitsOrdered: number;

    @Column({ name: 'visits_delivered', type: 'int', default: 0 })
    visitsDelivered: number;

    @Column({
        type: 'enum',
        enum: CampaignStatus,
        default: CampaignStatus.ACTIVE,
    })
    status: CampaignStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
