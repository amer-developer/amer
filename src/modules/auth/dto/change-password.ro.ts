'use strict';

import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

@ObjectType()
export class ChangePasswordRo {
    @Field()
    @ApiProperty({ required: true })
    message: string;

    @Field()
    @ApiProperty({ required: false })
    @IsPhoneNumber('ZZ')
    phone: string;

    constructor(message: string, phone: string) {
        this.message = message;
        this.phone = phone;
    }
}
