'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';

import { OfferStatus } from '../../../common/constants/offer-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ImageDto } from '../../image/dto/image.dto';
import { RequestDto } from '../../request/dto/request.dto';
import { StoreDto } from '../../store/dto/store.dto';
import { UserDto } from '../../user/dto/user.dto';
import { OfferEntity } from '../offer.entity';

@ObjectType()
export class OfferDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsNumber()
    @Type(() => Number)
    reference: number;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    title: string;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsString()
    @IsOptional()
    description: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    @Type(() => Number)
    price: number;

    @Field({ nullable: true })
    @ApiProperty({ required: false, default: 'SAR' })
    @IsString()
    @IsOptional()
    priceCurrency: string;

    @Field(() => [ImageDto], { nullable: true })
    @ApiProperty({ required: false, type: () => [ImageDto] })
    @IsObject()
    @IsOptional()
    images: ImageDto[];

    @Field(() => RequestDto, { nullable: false })
    @ApiProperty({ required: false })
    @IsObject()
    request: RequestDto;

    @Field(() => UserDto, { nullable: false })
    @ApiProperty({ required: false })
    @IsObject()
    owner: UserDto;

    @Field(() => StoreDto, { nullable: false })
    @ApiProperty({ required: false })
    @IsObject()
    store: StoreDto;

    @Field(() => OfferStatus)
    @ApiProperty({
        required: false,
        enum: OfferStatus,
        default: OfferStatus.ACTIVE,
    })
    @IsEnum(OfferStatus)
    @IsOptional()
    status: OfferStatus;

    constructor(offer: OfferEntity) {
        super(offer);
        this.reference = offer.reference;
        this.title = offer.title;
        this.description = offer.description;
        this.price = offer.price;
        this.priceCurrency = offer.priceCurrency;
        if (offer.images) {
            this.images = offer.images.toDtos();
        }
        if (offer.store) {
            this.store = offer.store.toDto();
        }
        if (offer.request) {
            this.request = offer.request.toDto();
        }
        if (offer.owner) {
            this.owner = offer.owner.toDto();
        }
        this.status = offer.status;
    }
}
