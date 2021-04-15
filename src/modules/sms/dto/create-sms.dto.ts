'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

@ArgsType()
export class CreateSMSDto {
    @Field()
    @ApiProperty({ required: true })
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field()
    @ApiProperty({ required: true })
    @IsString()
    body: string;
}
