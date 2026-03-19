import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreditPackage } from './entities/credit-package.entity';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreditTransaction, TransactionType } from './entities/credit-transaction.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BillingService {
    constructor(
        @InjectRepository(CreditPackage)
        private packageRepo: Repository<CreditPackage>,
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        @InjectRepository(CreditTransaction)
        private txRepo: Repository<CreditTransaction>,
        private dataSource: DataSource
    ) { }

    async getActivePackages() {
        return this.packageRepo.find({ where: { isActive: true }, order: { price: 'ASC' } });
    }

    async getHistory(userId: string) {
        return this.paymentRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }

    async createPaymentIntent(userId: string, packageId: string) {
        const pkg = await this.packageRepo.findOne({ where: { id: packageId, isActive: true } });
        if (!pkg) {
            throw new NotFoundException('Credit package not found or inactive');
        }

        // Dummy Payment Intent creation
        const payment = this.paymentRepo.create({
            user: { id: userId },
            packageId: pkg.id,
            amount: pkg.price,
            currency: pkg.currency,
            status: PaymentStatus.PENDING,
            gatewayRef: `pi_dummy_${Date.now()}_${userId}` // Placeholder
        });

        await this.paymentRepo.save(payment);

        return {
            paymentId: payment.id,
            clientSecret: payment.gatewayRef, // Return dummy secret for frontend
            amount: payment.amount,
            currency: payment.currency
        };
    }

    async confirmPaymentPlaceholder(userId: string, paymentId: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const payment = await queryRunner.manager.findOne(Payment, {
                where: { id: paymentId, user: { id: userId }, status: PaymentStatus.PENDING }
            });

            if (!payment) throw new NotFoundException('Pending payment not found');

            const pkg = await queryRunner.manager.findOne(CreditPackage, {
                where: { id: payment.packageId }
            });

            if (!pkg) throw new BadRequestException('Package associated with payment is invalid');

            // 1. Mark payment complete
            payment.status = PaymentStatus.COMPLETED;
            await queryRunner.manager.save(payment);

            // 2. Award User credits
            const user = await queryRunner.manager.findOne(User, {
                where: { id: userId },
                lock: { mode: 'pessimistic_write' }
            });

            if (!user) throw new NotFoundException('User not found');

            user.credits = Number(user.credits) + pkg.credits;
            await queryRunner.manager.save(user);

            // 3. Create Tx Log
            const tx = queryRunner.manager.create(CreditTransaction, {
                user: { id: userId },
                amount: pkg.credits,
                type: TransactionType.BUY,
                referenceId: payment.id
            });
            await queryRunner.manager.save(tx);

            await queryRunner.commitTransaction();

            return { success: true, newBalance: user.credits };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
