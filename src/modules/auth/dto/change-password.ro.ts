'use strict';

import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

@ObjectType()
export class ChangePasswordRo {
    @Field()
    @ApiProperty({ required: true })
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field()
    @ApiProperty({ required: true })
    message: string;

    constructor(message: string, phone: string) {
        this.phone = phone;
        this.message = message;
    }
}
