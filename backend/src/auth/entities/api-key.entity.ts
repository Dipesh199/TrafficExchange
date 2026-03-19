import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('api_keys')
export class ApiKey {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'key_hash', length: 255 })
    keyHash: string; // Stored hashed

    @Column({ length: 100 })
    name: string; // e.g., 'Production Env Key'

    @Column({ name: 'expires_at', nullable: true })
    expiresAt: Date;
}
