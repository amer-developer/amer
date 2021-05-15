'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { OfferRejectReason } from '../../../common/constants/offer-reject-reason';

@ArgsType()
export class RejectOfferDto {
    @Field(() => OfferRejectReason)
    @ApiProperty({
        required: false,
        enum: OfferRejectReason,
    })
    @IsEnum(OfferRejectReason)
    @IsOptional()
    code: OfferRejectReason;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    message: string;
}
