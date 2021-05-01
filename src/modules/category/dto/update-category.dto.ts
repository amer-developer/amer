/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateCategoryDto } from './create-category.dto';

@ArgsType()
export class UpdateCategoryInput extends GLPartialType(CreateCategoryDto) {}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
