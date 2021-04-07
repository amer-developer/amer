'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

@ArgsType()
export class CreateCountryDto {
    @Field({ nullable: false })
    @ApiProperty({ maxLength: 2, minLength: 2 })
    @IsString()
    @Length(2, 2)
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
