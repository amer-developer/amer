import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { ImageDto } from './image.dto';

@ObjectType()
export class ImagesPageDto {
    @Field(() => [ImageDto])
    @ApiProperty({
        type: ImageDto,
        isArray: true,
    })
    readonly data: ImageDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: ImageDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
