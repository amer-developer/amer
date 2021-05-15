'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

import { CategoryStatus } from '../../../common/constants/category-status';
import { CreateImageDto } from '../../image/dto/create-image.dto';

@ArgsType()
export class CreateCategoryDto {
    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameAR: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameEN: string;

    @Field(() => CreateImageDto, { nullable: false })
    @ApiProperty({ required: true, type: () => CreateImageDto })
    @Type(() => CreateImageDto)
    @IsOptional()
    @IsObject({ each: true })
    @ValidateNested()
    icon: CreateImageDto;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    backgroundColor: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    textColor: string;

    @Field(() => CategoryStatus, { nullable: true })
    @ApiProperty({
        required: true,
        enum: CategoryStatus,
        default: CategoryStatus.INACTIVE,
    })
    @IsEnum(CategoryStatus)
    @IsOptional()
    status: CategoryStatus;
}
