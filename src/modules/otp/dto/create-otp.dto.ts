'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPhoneNumber } from 'class-validator';

import { OtpReason } from '../../../common/constants/otp-reason';

@ArgsType()
export class CreateOtpDto {
    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field(() => OtpReason)
    @ApiProperty({ required: true, enum: OtpReason })
    @IsEnum(OtpReason)
    reason: OtpReason;
}
