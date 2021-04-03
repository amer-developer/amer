'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CountryDto } from '../../country/dto/country.dto';
import { CityEntity } from '../city.entity';

@ObjectType()
export class CityDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameAR: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameEN: string;

    @Field(() => CountryDto, { nullable: true })
    @ApiProperty()
    @IsObject()
    @IsOptional()
    country: CountryDto;

    constructor(city: CityEntity) {
        super(city);
        this.nameAR = city.nameAR;
        this.nameEN = city.nameEN;
        if (city.country) {
            this.country = city.country.toDto();
        }
    }
}
