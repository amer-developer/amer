'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CityDto } from '../../city/dto/city.dto';
import { CountryDto } from '../../country/dto/country.dto';
import { DistrictDto } from '../../district/dto/district.dto';
import { LocationEntity } from '../location.entity';

@ObjectType()
export class LocationDto extends AbstractDto {
    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address1: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address2: string;

    @Field(() => CountryDto, { nullable: true })
    @ApiProperty({ type: () => CountryDto })
    @IsObject()
    @IsOptional()
    country: CountryDto;

    @Field(() => CityDto, { nullable: true })
    @ApiProperty({ type: () => CityDto })
    @IsObject()
    @IsOptional()
    city: CityDto;

    @Field(() => DistrictDto, { nullable: true })
    @ApiProperty({ type: () => DistrictDto })
    @IsObject()
    @IsOptional()
    district: DistrictDto;

    constructor(location: LocationEntity) {
        super(location);
        this.address1 = location.address1;
        this.address2 = location.address2;
        if (location.country) {
            this.country = location.country.toDto();
        }
        if (location.city) {
            this.city = location.city.toDto();
        }
        if (location.district) {
            this.district = location.district.toDto();
        }
    }
}
