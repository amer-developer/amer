'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

import { SubCategoryStatus } from '../../../common/constants/sub-category-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CategoryDto } from '../../category/dto/category.dto';
import { SubCategoryEntity } from '../sub-category.entity';

@ObjectType()
export class SubCategoryDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameAR: string;

    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    nameEN: string;

    @Field(() => CategoryDto, { nullable: true })
    @ApiProperty({ type: () => CategoryDto })
    @IsObject()
    @IsOptional()
    category: CategoryDto;

    @Field(() => SubCategoryStatus)
    @ApiProperty({ required: true, enum: SubCategoryStatus })
    status: SubCategoryStatus;

    constructor(subCategory: SubCategoryEntity) {
        super(subCategory);
        this.nameAR = subCategory.nameAR;
        this.nameEN = subCategory.nameEN;
        this.status = subCategory.status;
        if (subCategory.category) {
            this.category = subCategory.category.toDto();
        }
    }
}
