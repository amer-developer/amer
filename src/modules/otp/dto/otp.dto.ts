'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

import { OTPReason } from '../../../common/constants/otp-reason';
import { OTPStatus } from '../../../common/constants/otp-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { OTPEntity } from '../otp.entity';

@ObjectType()
export class OTPDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty()
    code: string;

    @Field(() => OTPReason)
    @ApiProperty({ required: true, enum: OTPReason })
    reason: OTPReason;

    @Field({ nullable: false })
    @ApiProperty()
    attempt: number;

    @Field({ nullable: false })
    @ApiProperty()
    retry: number;

    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field(() => OTPStatus)
    @ApiProperty({ required: true, enum: OTPStatus })
    status: OTPStatus;

    constructor(otp: OTPEntity) {
        super(otp);
        this.code = otp.code;
        this.reason = otp.reason;
        this.attempt = otp.attempt;
        this.retry = otp.retry;
        this.phone = otp.phone;
        this.status = otp.status;
    }
}
