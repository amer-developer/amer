import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

import { OTPReason } from '../../../common/constants/otp-reason';
import { OTPStatus } from '../../../common/constants/otp-status';

@ObjectType()
export class OTPSentRo {
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

    constructor(
        reason: OTPReason,
        attempt: number,
        retry: number,
        phone: string,
        status: OTPStatus,
    ) {
        this.reason = reason;
        this.attempt = attempt;
        this.retry = retry;
        this.phone = phone;
        this.status = status;
    }
}
