import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum WebsiteStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    DISABLED = 'disabled',
    REJECTED = 'rejected',
}

@Entity('websites')
export class Website {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text' })
    url: string;

    @Column({ length: 100 })
    title: string;

    @Column({ length: 50, nullable: true })
    category: string;

    @Column({
        type: 'enum',
        enum: WebsiteStatus,
        default: WebsiteStatus.PENDING,
    })
    status: WebsiteStatus;

    @Column({ name: 'targeting_desktop', default: true })
    targetingDesktop: boolean;

    @Column({ name: 'targeting_mobile', default: true })
    targetingMobile: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
