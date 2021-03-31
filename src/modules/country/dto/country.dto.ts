'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CountryEntity } from '../country.entity';

@ObjectType()
export class CountryDto extends AbstractDto {
    @Field({ nullable: true })
    @ApiProperty({ maxLength: 2 })
    @MaxLength(2)
    code: string;

    @Field({ nullable: true })
    @ApiProperty()
    nameAR: string;

    @Field({ nullable: true })
    @ApiProperty()
    nameEN: string;

    constructor(country: CountryEntity) {
        super(country);
        this.code = country.code;
        this.nameAR = country.nameAR;
        this.nameEN = country.nameEN;
    }
}
