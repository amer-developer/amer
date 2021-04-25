'use strict';

import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

import { OTPSentRo } from '../../otp/dto/otp-send.ro';

@ObjectType()
export class ChangePasswordRo {
    @Field()
    @ApiProperty({ required: true })
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field()
    @ApiProperty({ required: true })
    message: string;

    @Field(() => OTPSentRo)
    @ApiProperty({ type: OTPSentRo })
    otp: OTPSentRo;

    constructor(message: string, phone: string, otp: OTPSentRo) {
        this.message = message;
        this.phone = phone;
        this.otp = otp;
    }
}
