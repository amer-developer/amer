import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountryModule } from '../country/country.module';
import { CityController } from './city.controller';
import { CityRepository } from './city.repository';
import { CityResolver } from './city.resolver';
import { CityService } from './city.service';

@Module({
    imports: [TypeOrmModule.forFeature([CityRepository]), CountryModule],
    controllers: [CityController],
    exports: [CityService],
    providers: [CityService, CityResolver],
})
export class CityModule {}
