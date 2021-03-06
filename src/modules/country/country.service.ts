import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindOneOptions } from 'typeorm';

import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { CountryNotFoundException } from '../../exceptions/country-not-found.exception';
import { ValidatorService } from '../../shared/services/validator.service';
import { CountryEntity } from './country.entity';
import { CountryRepository } from './country.repository';
import { CountriesPageOptionsDto } from './dto/countries-page-options.dto';
import { CountriesPageDto } from './dto/countries-page.dto';
import { CountryDto } from './dto/country.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

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
    findOne(
        findData: FindConditions<CountryEntity>,
        findOptions?: FindOneOptions<CountryEntity>,
    ): Promise<CountryEntity> {
        return this.countryRepository.findOne(findData, findOptions);
    }

    async createCountry(countryDto: CreateCountryDto): Promise<CountryDto> {
        const country = this.countryRepository.create(countryDto);

        const savedEntity = await this.countryRepository.save(country);
        return savedEntity.toDto();
    }

    async getCountries(
        pageOptionsDto: CountriesPageOptionsDto,
    ): Promise<CountriesPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.countryRepository.createQueryBuilder('country');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'nameAR',
                'nameEN',
                'code',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getCountry(id: string, options?: GetOptionsDto) {
        const countryEntity = await this.findOne(
            { id },
            { relations: options?.includes },
        );

        if (!countryEntity) {
            throw new CountryNotFoundException();
        }

        return countryEntity.toDto();
    }

    async updateCountry(id: string, country: UpdateCountryDto) {
        const countryEntity = await this.findOne({ id });
        if (!countryEntity) {
            throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
        }

        await this.countryRepository.save({
            id: countryEntity.id,
            ...country,
        });

        let updatedCountry = countryEntity.toDto();
        updatedCountry = { ...updatedCountry, ...country };

        return updatedCountry;
    }

    async deleteCountry(id: string) {
        const countryEntity = await this.findOne({ id });
        if (!countryEntity) {
            throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
        }
        await this.countryRepository.delete({
            id: countryEntity.id,
        });
        return countryEntity.toDto();
    }
}
