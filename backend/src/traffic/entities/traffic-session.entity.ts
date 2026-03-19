import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Website } from '../../websites/entities/website.entity';

export enum TrafficSessionStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

@Entity('traffic_sessions')
export class TrafficSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' }) // Nullable if anonymous surfing is allowed
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Website, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'website_id' })
    website: Website;

    @Column({ name: 'ip_address', length: 45 })
    ipAddress: string;

    @Column({ name: 'user_agent', type: 'text' })
    userAgent: string;

    @Column({ type: 'int' })
    duration: number; // in seconds

    @Column({
        type: 'enum',
        enum: TrafficSessionStatus,
        default: TrafficSessionStatus.PENDING,
    })
    status: TrafficSessionStatus;

    @Column({ name: 'verified_at', nullable: true })
    verifiedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
