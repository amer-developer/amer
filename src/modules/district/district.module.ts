import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CityModule } from '../city/city.module';
import { DistrictController } from './district.controller';
import { DistrictRepository } from './district.repository';
import { DistrictResolver } from './district.resolver';
import { DistrictService } from './district.service';

@Module({
    imports: [TypeOrmModule.forFeature([DistrictRepository]), CityModule],
    controllers: [DistrictController],
    exports: [DistrictService],
    providers: [DistrictService, DistrictResolver],
})
export class DistrictModule {}
