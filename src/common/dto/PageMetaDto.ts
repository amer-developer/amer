import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from './PageOptionsDto';

interface IPageMetaDtoParameters {
    pageOptionsDto: PageOptionsDto;
    itemCount: number;
}

@ObjectType()
export class PageMetaDto {
    @Field(() => Int)
    @ApiProperty()
    readonly page: number;

    @Field(() => Int)
    @ApiProperty()
    readonly take: number;

    @Field(() => Int)
    @ApiProperty()
    readonly itemCount: number;

    @Field(() => Int)
    @ApiProperty()
    readonly pageCount: number;

    @Field(() => Boolean)
    @ApiProperty()
    readonly hasPreviousPage: boolean;

    @Field(() => Boolean)
    @ApiProperty()
    readonly hasNextPage: boolean;

    constructor({ pageOptionsDto, itemCount }: IPageMetaDtoParameters) {
        this.page = pageOptionsDto.page;
        this.take = pageOptionsDto.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
