import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { CityDto } from './city.dto';

@ObjectType()
export class CitiesPageDto {
    @Field(() => [CityDto])
    @ApiProperty({
        type: CityDto,
        isArray: true,
    })
    readonly data: CityDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: CityDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
