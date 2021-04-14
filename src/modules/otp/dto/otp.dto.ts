'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

import { OtpReason } from '../../../common/constants/otp-reason';
import { OtpStatus } from '../../../common/constants/otp-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { OtpEntity } from '../otp.entity';

@ObjectType()
export class OtpDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty()
    code: string;

    @Field(() => OtpReason)
    @ApiProperty({ required: true, enum: OtpReason })
    reason: OtpReason;

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

    @Field(() => OtpStatus)
    @ApiProperty({ required: true, enum: OtpStatus })
    status: OtpStatus;

    constructor(otp: OtpEntity) {
        super(otp);
        this.code = otp.code;
        this.reason = otp.reason;
        this.attempt = otp.attempt;
        this.retry = otp.retry;
        this.phone = otp.phone;
        this.status = otp.status;
    }
}
