import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Payment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'payment_id' })
    payment: Payment;

    @Column({ type: 'text' })
    url: string; // PDF URL or frontend viewing link

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
