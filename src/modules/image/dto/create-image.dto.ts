'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateImageDto {
    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    name: string;
}
