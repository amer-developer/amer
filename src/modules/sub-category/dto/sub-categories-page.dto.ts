import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { SubCategoryDto } from './sub-category.dto';

@ObjectType()
export class SubCategoriesPageDto {
    @Field(() => [SubCategoryDto])
    @ApiProperty({
        type: SubCategoryDto,
        isArray: true,
    })
    readonly data: SubCategoryDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: SubCategoryDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
