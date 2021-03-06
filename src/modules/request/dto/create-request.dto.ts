/* eslint-disable max-classes-per-file */
'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    ValidateNested,
} from 'class-validator';

import { RequestStatus } from '../../../common/constants/request-status';
import { CreateImageDto } from '../../image/dto/create-image.dto';
import { CreateLocationDto } from '../../location/dto/create-location.dto';

@ArgsType()
export class CreateRequestDto {
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
    budgetMin: number;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsOptional()
    budgetMax: number;

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
    budgetCurrency: string;

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

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsUUID()
    categoryID: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    subCategoryID: string;

    @Field(() => CreateLocationDto, { nullable: false })
    @ApiProperty({ required: true, type: () => CreateLocationDto })
    @Type(() => CreateLocationDto)
    @IsObject({ each: true })
    @ValidateNested()
    location: CreateLocationDto;

    @Field(() => RequestStatus)
    @ApiProperty({
        required: false,
        enum: RequestStatus,
        default: RequestStatus.ACTIVE,
    })
    @IsEnum(RequestStatus)
    @IsOptional()
    status: RequestStatus;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    ownerID: string;
}
