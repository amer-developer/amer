import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { CategoryDto } from './category.dto';

@ObjectType()
export class CategoriesPageDto {
    @Field(() => [CategoryDto])
    @ApiProperty({
        type: CategoryDto,
        isArray: true,
    })
    readonly data: CategoryDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: CategoryDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
