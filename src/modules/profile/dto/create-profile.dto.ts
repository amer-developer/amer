'use strict';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateProfileDto {
    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    bio: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    avatar: string;
}
