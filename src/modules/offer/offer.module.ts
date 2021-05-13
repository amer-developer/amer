import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageModule } from '../image/image.module';
import { RequestModule } from '../request/request.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { OfferController } from './offer.controller';
import { OfferRepository } from './offer.repository';
import { OfferResolver } from './offer.resolver';
import { OfferService } from './offer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([OfferRepository]),
        StoreModule,
        RequestModule,
        ImageModule,
        UserModule,
    ],
    controllers: [OfferController],
    exports: [OfferService],
    providers: [OfferService, OfferResolver],
})
export class OfferModule {}
