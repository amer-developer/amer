'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { ImageFolder } from '../../../common/constants/image-folder';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ImageEntity } from '../image.entity';

@ObjectType()
export class ImageDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty()
    name: string;

    @Field(() => ImageFolder)
    @ApiProperty({ required: false, enum: ImageFolder })
    folder: ImageFolder;

    @Field({ nullable: false })
    @ApiProperty()
    url: string;

    constructor(image: ImageEntity) {
        super(image);
        this.name = image.name;
        this.folder = image.folder;
        this.url = image.url;
    }
}
