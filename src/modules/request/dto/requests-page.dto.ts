import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { RequestDto } from './request.dto';

@ObjectType()
export class RequestsPageDto {
    @Field(() => [RequestDto])
    @ApiProperty({
        type: RequestDto,
        isArray: true,
    })
    readonly data: RequestDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: RequestDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
