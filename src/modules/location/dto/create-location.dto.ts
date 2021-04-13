'use strict';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateLocationDto {
    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address1?: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address2?: string;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsUUID()
    cityID: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    districtID?: string;
}
