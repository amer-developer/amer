/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateSubCategoryDto } from './create-sub-category.dto';

@ArgsType()
export class UpdateSubCategoryInput extends GLPartialType(
    CreateSubCategoryDto,
) {}

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
