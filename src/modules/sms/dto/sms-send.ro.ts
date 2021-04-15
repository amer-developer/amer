import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

import { SMSStatus } from '../../../common/constants/sms-status';

@ObjectType()
export class SMSSentRo {
    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    body: string;

    @Field(() => SMSStatus)
    @ApiProperty({ required: true, enum: SMSStatus })
    status: SMSStatus;

    constructor(phone: string, body: string, status: SMSStatus) {
        this.phone = phone;
        this.body = body;
        this.status = status;
    }
}
