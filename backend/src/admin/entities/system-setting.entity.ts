import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSetting {
    @PrimaryColumn({ length: 100 })
    key: string; // e.g., 'CREDIT_RATES', 'SITE_STATUS'

    @Column({ type: 'text' })
    value: string; // JSON string or plain text

    @Column({ type: 'text', nullable: true })
    description: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
