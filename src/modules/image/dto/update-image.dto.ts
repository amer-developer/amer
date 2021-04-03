/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateImageDto } from './create-image.dto';

@ArgsType()
export class UpdateImageInput extends GLPartialType(CreateImageDto) {}

export class UpdateImageDto extends PartialType(CreateImageDto) {}
