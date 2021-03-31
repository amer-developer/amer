import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountryController } from './country.controller';
import { CountryRepository } from './country.repository';
import { CountryResolver } from './country.resolver';
import { CountryService } from './country.service';

@Module({
    imports: [TypeOrmModule.forFeature([CountryRepository])],
    controllers: [CountryController],
    exports: [CountryService],
    providers: [CountryService, CountryResolver],
})
export class CountryModule {}
