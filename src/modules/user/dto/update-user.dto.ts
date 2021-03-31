/* eslint-disable max-classes-per-file */
import { InputType, OmitType as GLOmitType } from '@nestjs/graphql';
import { OmitType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

@InputType()
export class UpdateUserInput extends GLOmitType(UserDto, [
    'createdAt',
    'updatedAt',
    'role',
    'phone',
    'email',
    'id',
] as const) {}

export class UpdateUserDto extends OmitType(UserDto, [
    'createdAt',
    'updatedAt',
    'role',
    'phone',
    'email',
    'id',
] as const) {}
