'use strict';

import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dto/user.dto';
import { TokenRo } from './token.ro';

@ObjectType()
export class LoginRo {
    @Field(() => UserDto)
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @Field(() => TokenRo)
    @ApiProperty({ type: TokenRo })
    token: TokenRo;

    constructor(user: UserDto, token: TokenRo) {
        this.user = user;
        this.token = token;
    }
}
