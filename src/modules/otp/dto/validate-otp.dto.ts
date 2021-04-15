'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPhoneNumber, IsString } from 'class-validator';

import { OTPReason } from '../../../common/constants/otp-reason';

@ArgsType()
export class ValidateOTPDto {
    @Field()
    @ApiProperty()
    @IsString()
    code: string;

    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field(() => OTPReason)
    @ApiProperty({ required: true, enum: OTPReason })
    @IsEnum(OTPReason)
    reason: OTPReason;
}
