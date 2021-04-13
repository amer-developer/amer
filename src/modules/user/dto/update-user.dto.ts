/* eslint-disable max-classes-per-file */
import { InputType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { RegisterDto } from '../../auth/dto/register.dto';

@InputType()
export class UpdateUserInput extends GLPartialType(RegisterDto) {}

export class UpdateUserDto extends PartialType(RegisterDto) {}
