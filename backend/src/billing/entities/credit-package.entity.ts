import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('credit_packages')
export class CreditPackage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'int' })
    credits: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ length: 3, default: 'USD' }) // e.g., 'USD'
    currency: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
