import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { SMSModule } from '../sms/sms.module';
import { OtpController } from './otp.controller';
import { OtpRepository } from './otp.repository';
import { OtpResolver } from './otp.resolver';
import { OtpService } from './otp.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([OtpRepository]),
        SMSModule,
        SharedModule,
    ],
    controllers: [OtpController],
    exports: [OtpService],
    providers: [OtpService, OtpResolver],
})
export class OtpModule {}
