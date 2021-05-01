'use strict';

import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';
@ArgsType()
export class LoginDto {
    @Field()
    @ApiProperty({ example: '+966500878033' })
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field()
    @IsString()
    @ApiProperty()
    readonly password: string;
}
