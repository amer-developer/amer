'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CityDto } from '../../city/dto/city.dto';
import { CountryEntity } from '../country.entity';

@ObjectType()
export class CountryDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty({ maxLength: 2 })
    @IsString()
    @MaxLength(2)
    code: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameAR: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameEN: string;

    @Field(() => [CityDto], { nullable: true })
    @ApiProperty()
    @IsObject()
    @IsOptional()
    cities: CityDto[];

    constructor(country: CountryEntity) {
        super(country);
        this.code = country.code;
        this.nameAR = country.nameAR;
        this.nameEN = country.nameEN;
        if (country.cities) {
            this.cities = country.cities.toDtos();
        }
    }
}
