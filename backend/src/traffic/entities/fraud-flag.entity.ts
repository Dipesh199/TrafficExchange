import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Website } from '../../websites/entities/website.entity';

export enum FraudSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

@Entity('fraud_flags')
export class FraudFlag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Website, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'website_id' })
    website: Website;

    @Column({ type: 'text' })
    reason: string;

    @Column({
        type: 'enum',
        enum: FraudSeverity,
        default: FraudSeverity.LOW,
    })
    severity: FraudSeverity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
