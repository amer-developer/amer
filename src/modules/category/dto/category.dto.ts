'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

import { CategoryStatus } from '../../../common/constants/category-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { SubCategoryDto } from '../../sub-category/dto/sub-category.dto';
import { CategoryEntity } from '../category.entity';

@ObjectType()
export class CategoryDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsString()
    nameAR: string;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsString()
    nameEN: string;

    @Field(() => CategoryStatus)
    @ApiProperty({ required: true, enum: CategoryStatus })
    status: CategoryStatus;

    @Field(() => [SubCategoryDto], { nullable: true })
    @ApiProperty({ required: false, type: () => [SubCategoryDto] })
    @IsObject()
    @IsOptional()
    subCategories: SubCategoryDto[];

    constructor(category: CategoryEntity) {
        super(category);
        this.nameAR = category.nameAR;
        this.nameEN = category.nameEN;
        this.status = category.status;
        if (category.subCategories) {
            this.subCategories = category.subCategories.toDtos();
        }
    }
}
