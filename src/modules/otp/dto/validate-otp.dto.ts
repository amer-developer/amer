'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPhoneNumber, IsString } from 'class-validator';

import { OtpReason } from '../../../common/constants/otp-reason';

@ArgsType()
export class ValidateOtpDto {
    @Field()
    @ApiProperty()
    @IsString()
    code: string;

    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field(() => OtpReason)
    @ApiProperty({ required: true, enum: OtpReason })
    @IsEnum(OtpReason)
    reason: OtpReason;
}
