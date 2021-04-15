import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { SMSModule } from '../sms/sms.module';
import { OTPController } from './otp.controller';
import { OTPRepository } from './otp.repository';
import { OTPResolver } from './otp.resolver';
import { OTPService } from './otp.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([OTPRepository]),
        SMSModule,
        SharedModule,
    ],
    controllers: [OTPController],
    exports: [OTPService],
    providers: [OTPService, OTPResolver],
})
export class OTPModule {}
