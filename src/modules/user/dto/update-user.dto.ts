/* eslint-disable max-classes-per-file */
import { InputType, OmitType as GLOmitType } from '@nestjs/graphql';
import { OmitType } from '@nestjs/swagger';

import { RegisterDto } from '../../auth/dto/register.dto';

@InputType()
export class UpdateUserInput extends GLOmitType(RegisterDto, [
    'phone',
    'email',
] as const) {}

export class UpdateUserDto extends OmitType(RegisterDto, [
    'phone',
    'email',
] as const) {}
