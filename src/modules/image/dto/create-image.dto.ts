'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ImageFolder } from '../../../common/constants/image-folder';

@ArgsType()
export class CreateImageDto {
    @Field({ nullable: true })
    @ApiProperty({ required: true })
    @IsOptional()
    @IsString()
    name: string;

    @Field(() => ImageFolder)
    @ApiProperty({ required: false, enum: ImageFolder })
    @IsEnum(ImageFolder)
    @IsOptional()
    folder: ImageFolder;
}
