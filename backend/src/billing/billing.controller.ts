import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    // Public or protected based on preference. Let's make it public to show packages to logged out users too.
    @Get('packages')
    async getPackages() {
        return this.billingService.getActivePackages();
    }

    @UseGuards(JwtAuthGuard)
    @Get('history')
    async getBillingHistory(@Req() req: any) {
        return this.billingService.getHistory(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('intent')
    async createIntent(@Req() req: any, @Body() dto: CreatePaymentIntentDto) {
        return this.billingService.createPaymentIntent(req.user.id, dto.packageId);
    }

    // A dummy webhook or frontend confirmation endpoint
    @UseGuards(JwtAuthGuard)
    @Post('confirm/:paymentId')
    async confirmPayment(@Req() req: any, @Param('paymentId') paymentId: string) {
        return this.billingService.confirmPaymentPlaceholder(req.user.id, paymentId);
    }
}
