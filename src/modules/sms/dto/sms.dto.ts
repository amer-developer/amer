'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

import { SMSStatus } from '../../../common/constants/sms-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { SMSEntity } from '../sms.entity';

@ObjectType()
export class SMSDto extends AbstractDto {
    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field({ nullable: false })
    @ApiProperty()
    body: string;

    @Field(() => SMSStatus)
    @ApiProperty({ required: true, enum: SMSStatus })
    status: SMSStatus;

    constructor(sms: SMSEntity) {
        super(sms);
        this.phone = sms.phone;
        this.body = sms.body;
        this.status = sms.status;
    }
}
