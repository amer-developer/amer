/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateRequestDto } from './create-request.dto';

@ArgsType()
export class UpdateRequestInput extends GLPartialType(CreateRequestDto) {}

export class UpdateRequestDto extends PartialType(CreateRequestDto) {}
