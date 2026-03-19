import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_settings')
export class UserSetting {
    @PrimaryColumn('uuid')
    userId: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'profile_info', type: 'jsonb', nullable: true })
    profileInfo: any;

    @Column({ name: '2fa_enabled', default: false })
    twoFaEnabled: boolean;

    @Column({ name: '2fa_secret', nullable: true })
    twoFaSecret: string;
}
