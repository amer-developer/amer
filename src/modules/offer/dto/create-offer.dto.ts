/* eslint-disable max-classes-per-file */
'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    ValidateNested,
} from 'class-validator';

import { OfferStatus } from '../../../common/constants/offer-status';
import { CreateImageDto } from '../../image/dto/create-image.dto';

@ArgsType()
export class CreateOfferDto {
    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    title: string;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsString()
    description: string;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @Field({ nullable: true })
    @ApiProperty({
        required: false,
        default: 'SAR',
        maxLength: 3,
        minLength: 3,
    })
    @IsString()
    @Length(3, 3)
    @IsOptional()
    priceCurrency: string;

    @Field(() => [CreateImageDto], { nullable: true })
    @ApiProperty({
        required: false,
        isArray: true,
        type: () => CreateImageDto,
    })
    @IsArray()
    @IsOptional()
    @Type(() => CreateImageDto)
    @ValidateNested({ each: true })
    images: CreateImageDto[];

    @Field(() => OfferStatus)
    @ApiProperty({
        required: false,
        enum: OfferStatus,
        default: OfferStatus.ACTIVE,
    })
    @IsEnum(OfferStatus)
    @IsOptional()
    status: OfferStatus;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    ownerID: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    storeID: string;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsUUID()
    requestID: string;
}
