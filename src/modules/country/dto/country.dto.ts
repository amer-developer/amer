'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CountryEntity } from '../country.entity';

@ObjectType()
export class CountryDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty({ maxLength: 2 })
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

    constructor(country: CountryEntity) {
        super(country);
        this.code = country.code;
        this.nameAR = country.nameAR;
        this.nameEN = country.nameEN;
    }
}
