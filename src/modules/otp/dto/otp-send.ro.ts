import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

import { OtpReason } from '../../../common/constants/otp-reason';
import { OtpStatus } from '../../../common/constants/otp-status';

@ObjectType()
export class OtpSentRo {
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

    constructor(
        reason: OtpReason,
        attempt: number,
        retry: number,
        phone: string,
        status: OtpStatus,
    ) {
        this.reason = reason;
        this.attempt = attempt;
        this.retry = retry;
        this.phone = phone;
        this.status = status;
    }
}
