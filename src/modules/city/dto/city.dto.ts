'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
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

    constructor(city: CityEntity) {
        super(city);
        this.nameAR = city.nameAR;
        this.nameEN = city.nameEN;
    }
}
