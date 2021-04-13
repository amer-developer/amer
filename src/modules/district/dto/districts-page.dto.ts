import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { DistrictDto } from './district.dto';

@ObjectType()
export class DistrictsPageDto {
    @Field(() => [DistrictDto])
    @ApiProperty({
        type: DistrictDto,
        isArray: true,
    })
    readonly data: DistrictDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: DistrictDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
