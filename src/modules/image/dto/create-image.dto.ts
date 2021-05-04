'use strict';
import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { ImageFolder } from '../../../common/constants/image-folder';

@InputType()
@ArgsType()
export class CreateImageDto {
    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    id: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    url: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name: string;

    @Field(() => ImageFolder, { nullable: true })
    @ApiProperty({ required: false, enum: ImageFolder })
    @IsEnum(ImageFolder)
    @IsOptional()
    folder: ImageFolder;
}
