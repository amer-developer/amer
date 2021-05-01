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
    ValidateNested,
} from 'class-validator';

import { RequestStatus } from '../../../common/constants/request-status';
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
    @ApiProperty({ required: false, default: 'SAR' })
    @IsString()
    @IsOptional()
    budgetCurrency: string;

    @Field(() => [String], { nullable: true })
    @ApiProperty({ required: false, isArray: true, type: [String] })
    @IsArray()
    @IsOptional()
    images: string[];

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsUUID()
    categoryID: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    subCategoryID: string;

    @Field(() => CreateLocationDto, { nullable: true })
    @ApiProperty({ required: false, type: () => CreateLocationDto })
    @IsOptional()
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
}
