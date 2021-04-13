'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CityDto } from '../../city/dto/city.dto';
import { DistrictEntity } from '../district.entity';

@ObjectType()
export class DistrictDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameAR: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameEN: string;

    @Field(() => CityDto, { nullable: false })
    @ApiProperty({ required: true, type: () => CityDto })
    @IsObject()
    city: CityDto;

    constructor(district: DistrictEntity) {
        super(district);
        this.nameAR = district.nameAR;
        this.nameEN = district.nameEN;
        if (district.city) {
            this.city = district.city.toDto();
        }
    }
}
