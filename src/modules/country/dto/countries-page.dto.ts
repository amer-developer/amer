import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { CountryDto } from './country.dto';

@ObjectType()
export class CountriesPageDto {
    @Field(() => [CountryDto])
    @ApiProperty({
        type: CountryDto,
        isArray: true,
    })
    readonly data: CountryDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: CountryDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
