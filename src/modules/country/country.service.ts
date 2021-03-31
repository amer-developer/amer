import { Injectable, Logger } from '@nestjs/common';
import { FindConditions } from 'typeorm';

import { ValidatorService } from '../../shared/services/validator.service';
import { CountryEntity } from './country.entity';
import { CountryRepository } from './country.repository';
import { CountriesPageOptionsDto } from './dto/countries-page-options.dto';
import { CountriesPageDto } from './dto/countries-page.dto';
import { CountryDto } from './dto/country.dto';

@Injectable()
export class CountryService {
    private logger = new Logger(CountryService.name);
    constructor(
        public readonly countryRepository: CountryRepository,
        public readonly validatorService: ValidatorService,
    ) {}

    /**
     * Find single country
     */
    findOne(findData: FindConditions<CountryEntity>): Promise<CountryEntity> {
        return this.countryRepository.findOne(findData);
    }

    async createCountry(countryDto: CountryDto): Promise<CountryEntity> {
        const country = this.countryRepository.create(countryDto);

        return this.countryRepository.save(country);
    }

    async getCountries(
        pageOptionsDto: CountriesPageOptionsDto,
    ): Promise<CountriesPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        const queryBuilder = this.countryRepository.createQueryBuilder(
            'country',
        );
        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getCountry(id: string) {
        const countryEntity = await this.findOne({ id });

        return countryEntity.toDto();
    }
}
