'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ImageEntity } from '../image.entity';

@ObjectType()
export class ImageDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty()
    name: string;

    constructor(image: ImageEntity) {
        super(image);
        this.name = image.name;
    }
}
