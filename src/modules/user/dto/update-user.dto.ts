/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

@ArgsType()
export class UpdateUserInput extends GLPartialType(CreateUserDto) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
