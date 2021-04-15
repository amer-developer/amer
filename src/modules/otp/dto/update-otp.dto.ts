/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateOTPDto } from './create-otp.dto';

@ArgsType()
export class UpdateOTPInput extends GLPartialType(CreateOTPDto) {}

export class UpdateOTPDto extends PartialType(CreateOTPDto) {}
