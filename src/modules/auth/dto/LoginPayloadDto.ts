'use strict';

import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dto/UserDto';
import { TokenPayloadDto } from './TokenPayloadDto';

@ObjectType()
export class LoginPayloadDto {
    @Field(() => UserDto)
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @Field(() => TokenPayloadDto)
    @ApiProperty({ type: TokenPayloadDto })
    token: TokenPayloadDto;

    constructor(user: UserDto, token: TokenPayloadDto) {
        this.user = user;
        this.token = token;
    }
}
