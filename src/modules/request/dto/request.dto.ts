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

import { RequestStatus } from '../../../common/constants/request-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CategoryDto } from '../../category/dto/category.dto';
import { ImageDto } from '../../image/dto/image.dto';
import { LocationDto } from '../../location/dto/location.dto';
import { SubCategoryDto } from '../../sub-category/dto/sub-category.dto';
import { UserDto } from '../../user/dto/user.dto';
import { RequestEntity } from '../request.entity';

@ObjectType()
export class RequestDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsNumber()
    @Type(() => Number)
    reference: number;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsString()
    title: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    @Type(() => Number)
    budgetMin: number;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    @Type(() => Number)
    budgetMax: number;

    @Field({ nullable: true })
    @ApiProperty({ required: false, default: 'SAR' })
    @IsString()
    @IsOptional()
    budgetCurrency: string;

    @Field(() => [ImageDto], { nullable: true })
    @ApiProperty({ required: false, type: () => [ImageDto] })
    @IsObject()
    @IsOptional()
    images: ImageDto[];

    @Field(() => CategoryDto, { nullable: false })
    @ApiProperty({ required: false })
    @IsObject()
    category: CategoryDto;

    @Field(() => SubCategoryDto, { nullable: false })
    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    subCategory: SubCategoryDto;

    @Field(() => LocationDto, { nullable: true })
    @ApiProperty({ required: true, type: () => LocationDto })
    @IsOptional()
    @IsObject()
    location: LocationDto;

    @Field(() => UserDto, { nullable: false })
    @ApiProperty({ required: false })
    @IsObject()
    owner: UserDto;

    @Field(() => RequestStatus)
    @ApiProperty({
        required: false,
        enum: RequestStatus,
        default: RequestStatus.ACTIVE,
    })
    @IsEnum(RequestStatus)
    @IsOptional()
    status: RequestStatus;

    constructor(request: RequestEntity) {
        super(request);
        this.reference = request.reference;
        this.title = request.title;
        this.description = request.description;
        this.budgetMin = request.budgetMin;
        this.budgetMax = request.budgetMax;
        this.budgetCurrency = request.budgetCurrency;
        if (request.images) {
            this.images = request.images.toDtos();
        }
        if (request.location) {
            this.location = request.location.toDto();
        }
        if (request.category) {
            this.category = request.category.toDto();
        }
        if (request.subCategory) {
            this.subCategory = request.subCategory.toDto();
        }
        if (request.owner) {
            this.owner = request.owner.toDto();
        }
        this.status = request.status;
    }
}
