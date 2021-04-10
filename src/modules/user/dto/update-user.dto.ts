/* eslint-disable max-classes-per-file */
import { InputType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

@InputType()
export class UpdateUserInput extends GLPartialType(UserDto) {}

export class UpdateUserDto extends PartialType(UserDto) {}
