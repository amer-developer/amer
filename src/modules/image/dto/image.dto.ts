'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { ImageFolder } from '../../../common/constants/image-folder';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ImageEntity } from '../image.entity';

@ObjectType()
export class ImageDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty()
    @IsString()
    name: string;

    @Field(() => ImageFolder, { nullable: false })
    @ApiProperty({ required: true, enum: ImageFolder })
    @IsEnum(ImageFolder)
    folder: ImageFolder;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsString()
    url: string;

    constructor(image: ImageEntity) {
        super(image);
        this.name = image.name;
        this.folder = image.folder;
        this.url = image.url;
    }
}
