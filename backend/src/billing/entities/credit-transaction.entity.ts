import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TransactionType {
    EARN = 'earn',
    SPEND = 'spend',
    BUY = 'buy',
    ADMIN = 'admin',
}

@Entity('credit_transactions')
export class CreditTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: TransactionType,
    })
    type: TransactionType;

    @Column({ name: 'reference_id', nullable: true })
    referenceId: string; // e.g., session ID, campaign ID, or payment ID

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
