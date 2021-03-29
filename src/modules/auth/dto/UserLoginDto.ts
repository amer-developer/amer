'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class UserLoginDto {
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @IsString()
    @ApiProperty()
    readonly password: string;
}
