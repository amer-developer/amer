/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateCountryDto } from './create-country.dto';

@ArgsType()
export class UpdateCountryInput extends GLPartialType(CreateCountryDto) {}

export class UpdateCountryDto extends PartialType(CreateCountryDto) {}
