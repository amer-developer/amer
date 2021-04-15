/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateSMSDto } from './create-sms.dto';

@ArgsType()
export class UpdateSMSInput extends GLPartialType(CreateSMSDto) {}

export class UpdateSMSDto extends PartialType(CreateSMSDto) {}
