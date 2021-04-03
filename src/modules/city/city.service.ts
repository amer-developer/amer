import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindConditions } from 'typeorm';

import { ValidatorService } from '../../shared/services/validator.service';
import { CountryService } from '../country/country.service';
import { CityEntity } from './city.entity';
import { CityRepository } from './city.repository';
import { CitiesPageOptionsDto } from './dto/cities-page-options.dto';
import { CitiesPageDto } from './dto/cities-page.dto';
import { CityDto } from './dto/city.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
    private logger = new Logger(CityService.name);
    constructor(
        public readonly cityRepository: CityRepository,
        public readonly validatorService: ValidatorService,
        public readonly countriesService: CountryService,
    ) {}

    /**
     * Find single city
     */
    findOne(findData: FindConditions<CityEntity>): Promise<CityEntity> {
        return this.cityRepository.findOne(findData);
    }

    async createCity(cityDto: CreateCityDto): Promise<CityDto> {
        const country = await this.countriesService.findOne({
            code: cityDto.countryCode,
        });
        if (!country) {
            throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
        }
        const city = this.cityRepository.create({ ...cityDto, country });

        const savedEntity = await this.cityRepository.save(city);
        return savedEntity.toDto();
    }

    async getCities(
        pageOptionsDto: CitiesPageOptionsDto,
    ): Promise<CitiesPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.cityRepository.createQueryBuilder('city');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'nameAR',
                'nameEN',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getCity(id: string) {
        const cityEntity = await this.findOne({ id });

        return cityEntity.toDto();
    }

    async updateCity(id: string, city: UpdateCityDto) {
        const cityEntity = await this.findOne({ id });
        if (!cityEntity) {
            throw new HttpException('City not found', HttpStatus.NOT_FOUND);
        }

        await this.cityRepository.save({
            id: cityEntity.id,
            ...city,
        });

        let updatedCity = cityEntity.toDto();
        updatedCity = { ...updatedCity, ...city };

        return updatedCity;
    }

    async deleteCity(id: string) {
        const cityEntity = await this.findOne({ id });
        if (!cityEntity) {
            throw new HttpException('City not found', HttpStatus.NOT_FOUND);
        }
        await this.cityRepository.delete({
            id: cityEntity.id,
        });
        return cityEntity.toDto();
    }
}
