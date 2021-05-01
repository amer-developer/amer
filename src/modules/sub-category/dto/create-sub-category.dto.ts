'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { SubCategoryStatus } from '../../../common/constants/sub-category-status';

@ArgsType()
export class CreateSubCategoryDto {
    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameAR: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameEN: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    categoryID: string;

    @Field(() => SubCategoryStatus, { nullable: true })
    @ApiProperty({
        required: true,
        enum: SubCategoryStatus,
        default: SubCategoryStatus.INACTIVE,
    })
    @IsEnum(SubCategoryStatus)
    @IsOptional()
    status: SubCategoryStatus;
}
