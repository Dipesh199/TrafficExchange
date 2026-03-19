import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Website } from './website.entity';

@Entity('website_verifications')
export class WebsiteVerification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Website, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'website_id' })
    website: Website;

    @Column({ length: 50 })
    method: string;

    @Column({ length: 255 })
    token: string;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ name: 'verified_at', nullable: true })
    verifiedAt: Date;
}
