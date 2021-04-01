'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

@ArgsType()
export class CreateCityDto {
    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameAR: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameEN: string;

    @Field({ nullable: false })
    @ApiProperty({ minLength: 2, maxLength: 2 })
    @IsString()
    @Length(2, 2)
    countryCode: string;
}
