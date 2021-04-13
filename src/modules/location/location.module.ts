import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityModule } from '../city/city.module';
import { DistrictModule } from '../district/district.module';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocationRepository]),
        CityModule,
        DistrictModule,
    ],
    controllers: [LocationController],
    exports: [LocationService],
    providers: [LocationService, LocationResolver],
})
export class LocationModule {}
