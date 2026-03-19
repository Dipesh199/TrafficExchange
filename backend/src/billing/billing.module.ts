import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { CreditPackage } from './entities/credit-package.entity';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import { CreditTransaction } from './entities/credit-transaction.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CreditPackage, Payment, Invoice, CreditTransaction, User])],
    controllers: [BillingController],
    providers: [BillingService],
    exports: [BillingService]
})
export class BillingModule { }
