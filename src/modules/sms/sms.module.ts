import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { SMSController } from './sms.controller';
import { SMSRepository } from './sms.repository';
import { SMSResolver } from './sms.resolver';
import { SMSService } from './sms.service';

@Module({
    imports: [TypeOrmModule.forFeature([SMSRepository]), SharedModule],
    controllers: [SMSController],
    exports: [SMSService],
    providers: [SMSService, SMSResolver],
})
export class SMSModule {}
