'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { CategoryStatus } from '../../../common/constants/category-status';

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
