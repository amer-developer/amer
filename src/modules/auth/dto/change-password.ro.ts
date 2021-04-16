'use strict';

import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ChangePasswordRo {
    @Field()
    @ApiProperty({ required: true })
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}
