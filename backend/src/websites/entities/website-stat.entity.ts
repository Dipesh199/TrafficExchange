import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Website } from './website.entity';

@Entity('website_stats')
export class WebsiteStat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Website, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'website_id' })
    website: Website;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'int', default: 0 })
    visits: number;

    @Column({ name: 'bounce_rate', type: 'decimal', precision: 5, scale: 2, default: 0.00 })
    bounceRate: number;

    @Column({ name: 'avg_duration', type: 'int', default: 0 }) // in seconds
    avgDuration: number;
}
