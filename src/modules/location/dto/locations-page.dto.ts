import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { LocationDto } from './location.dto';

@ObjectType()
export class LocationsPageDto {
    @Field(() => [LocationDto])
    @ApiProperty({
        type: LocationDto,
        isArray: true,
    })
    readonly data: LocationDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: LocationDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
