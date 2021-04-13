/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateDistrictDto } from './create-district.dto';

@ArgsType()
export class UpdateDistrictInput extends GLPartialType(CreateDistrictDto) {}

export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}
