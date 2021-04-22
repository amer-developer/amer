'use strict';

import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

@ObjectType()
export class ResetPasswordRo {
    @Field()
    @ApiProperty({ required: true })
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field()
    @ApiProperty({ required: true })
    message: string;

    constructor(message: string, phone: string) {
        this.message = message;
        this.phone = phone;
    }
}
