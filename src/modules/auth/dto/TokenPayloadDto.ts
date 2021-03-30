'use strict';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class TokenPayloadDto {
    @Field(() => Int)
    @ApiProperty()
    expiresIn: number;

    @Field()
    @ApiProperty()
    accessToken: string;

    constructor(data: { expiresIn: number; accessToken: string }) {
        this.expiresIn = data.expiresIn;
        this.accessToken = data.accessToken;
    }
}
