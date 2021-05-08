import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindConditions } from 'typeorm';

import { ValidatorService } from '../../shared/services/validator.service';
import { CityService } from '../city/city.service';
import { CityDto } from '../city/dto/city.dto';
import { DistrictEntity } from '../district/district.entity';
import { DistrictService } from '../district/district.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationDto } from './dto/location.dto';
import { LocationsPageOptionsDto } from './dto/locations-page-options.dto';
import { LocationsPageDto } from './dto/locations-page.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationEntity } from './location.entity';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
    private logger = new Logger(LocationService.name);
    constructor(
        public readonly locationRepository: LocationRepository,
        public readonly validatorService: ValidatorService,
        public readonly citiesService: CityService,
        public readonly districtService: DistrictService,
    ) {}

    /**
     * Find single location
     */
    findOne(findData: FindConditions<LocationEntity>): Promise<LocationEntity> {
        return this.locationRepository.findOne(findData);
    }

    async createLocation(
        locationDto: CreateLocationDto,
        existingID?: string,
    ): Promise<LocationDto> {
        let city: CityDto;

        if (locationDto.cityID) {
            city = await this.citiesService.findOne(
                {
                    id: locationDto.cityID,
                },
                { relations: ['country'] },
            );
            if (!city) {
                throw new HttpException('City not found', HttpStatus.NOT_FOUND);
            }
        }
        let district: DistrictEntity;
        if (locationDto.districtID) {
            district = await this.districtService.findOne(
                {
                    id: locationDto.districtID,
                },
                {
                    relations: ['city', 'city.country'],
                },
            );
            if (!district) {
                throw new HttpException(
                    'District not found',
                    HttpStatus.NOT_FOUND,
                );
            }
            if (
                locationDto.cityID &&
                district.city &&
                district.city.id !== locationDto.cityID
            ) {
                throw new HttpException(
                    'District does not belong to city',
                    HttpStatus.NOT_FOUND,
                );
            }
            city = district.city.toDto();
        }
        const location = this.locationRepository.create({
            id: existingID,
            ...locationDto,
            city,
            district,
            country: city.country,
        });

        const savedEntity = await this.locationRepository.save(location);
        return savedEntity.toDto();
    }

    async getLocations(
        pageOptionsDto: LocationsPageOptionsDto,
    ): Promise<LocationsPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.locationRepository.createQueryBuilder(
            'location',
        );

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

    async getLocation(id: string) {
        const locationEntity = await this.findOne({ id });

        return locationEntity.toDto();
    }

    async updateLocation(id: string, location: UpdateLocationDto) {
        const locationEntity = await this.findOne({ id });
        if (!locationEntity) {
            throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
        }

        await this.locationRepository.save({
            id: locationEntity.id,
            ...location,
        });

        let updatedLocation = locationEntity.toDto();
        updatedLocation = { ...updatedLocation, ...location };

        return updatedLocation;
    }

    async deleteLocation(id: string) {
        const locationEntity = await this.findOne({ id });
        if (!locationEntity) {
            throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
        }
        await this.locationRepository.delete({
            id: locationEntity.id,
        });
        return locationEntity.toDto();
    }
}
