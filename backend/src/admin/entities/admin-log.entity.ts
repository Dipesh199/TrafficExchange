import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Admin user

@Entity('admin_logs')
export class AdminLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'admin_id' })
    admin: User;

    @Column({ length: 150 })
    action: string; // e.g., 'Suspend User', 'Approve Website'

    @Column({ name: 'target_type', length: 50, nullable: true })
    targetType: string; // 'User', 'Website', 'Payment'

    @Column({ name: 'target_id', type: 'uuid', nullable: true })
    targetId: string;

    @Column({ type: 'jsonb', nullable: true })
    details: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
