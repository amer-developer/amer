'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

@ArgsType()
export class CreateCountryDto {
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
}
