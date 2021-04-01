/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateCityDto } from './create-city.dto';

@ArgsType()
export class UpdateCityInput extends GLPartialType(CreateCityDto) {}

export class UpdateCityDto extends PartialType(CreateCityDto) {}
