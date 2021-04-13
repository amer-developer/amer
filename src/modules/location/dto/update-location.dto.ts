/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateLocationDto } from './create-location.dto';

@ArgsType()
export class UpdateLocationInput extends GLPartialType(CreateLocationDto) {}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
