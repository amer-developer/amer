import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindConditions } from 'typeorm';

import { ValidatorService } from '../../shared/services/validator.service';
import { CityService } from '../city/city.service';
import { DistrictEntity } from './district.entity';
import { DistrictRepository } from './district.repository';
import { CreateDistrictDto } from './dto/create-district.dto';
import { DistrictDto } from './dto/district.dto';
import { DistrictsPageOptionsDto } from './dto/districts-page-options.dto';
import { DistrictsPageDto } from './dto/districts-page.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Injectable()
export class DistrictService {
    private logger = new Logger(DistrictService.name);
    constructor(
        public readonly districtRepository: DistrictRepository,
        public readonly validatorService: ValidatorService,
        public readonly citiesService: CityService,
    ) {}

    /**
     * Find single district
     */
    findOne(findData: FindConditions<DistrictEntity>): Promise<DistrictEntity> {
        return this.districtRepository.findOne(findData);
    }

    async createDistrict(districtDto: CreateDistrictDto): Promise<DistrictDto> {
        const city = await this.citiesService.findOne({
            id: districtDto.cityID,
        });
        if (!city) {
            throw new HttpException('City not found', HttpStatus.NOT_FOUND);
        }
        const district = this.districtRepository.create({
            ...districtDto,
            city,
        });

        const savedEntity = await this.districtRepository.save(district);
        return savedEntity.toDto();
    }

    async getDistricts(
        pageOptionsDto: DistrictsPageOptionsDto,
    ): Promise<DistrictsPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.districtRepository.createQueryBuilder(
            'district',
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

    async getDistrict(id: string) {
        const districtEntity = await this.findOne({ id });

        return districtEntity.toDto();
    }

    async updateDistrict(id: string, district: UpdateDistrictDto) {
        const districtEntity = await this.findOne({ id });
        if (!districtEntity) {
            throw new HttpException('District not found', HttpStatus.NOT_FOUND);
        }

        await this.districtRepository.save({
            id: districtEntity.id,
            ...district,
        });

        let updatedDistrict = districtEntity.toDto();
        updatedDistrict = { ...updatedDistrict, ...district };

        return updatedDistrict;
    }

    async deleteDistrict(id: string) {
        const districtEntity = await this.findOne({ id });
        if (!districtEntity) {
            throw new HttpException('District not found', HttpStatus.NOT_FOUND);
        }
        await this.districtRepository.delete({
            id: districtEntity.id,
        });
        return districtEntity.toDto();
    }
}
