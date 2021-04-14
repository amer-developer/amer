/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateOtpDto } from './create-otp.dto';

@ArgsType()
export class UpdateOtpInput extends GLPartialType(CreateOtpDto) {}

export class UpdateOtpDto extends PartialType(CreateOtpDto) {}
