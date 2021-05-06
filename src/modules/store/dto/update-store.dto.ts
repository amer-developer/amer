/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateStoreDto } from './create-store.dto';

@ArgsType()
export class UpdateStoreInput extends GLPartialType(CreateStoreDto) {}

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
