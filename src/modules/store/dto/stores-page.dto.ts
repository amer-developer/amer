import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { StoreDto } from './store.dto';

@ObjectType()
export class StoresPageDto {
    @Field(() => [StoreDto])
    @ApiProperty({
        type: StoreDto,
        isArray: true,
    })
    readonly data: StoreDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: StoreDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
