import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { OfferDto } from './offer.dto';

@ObjectType()
export class OffersPageDto {
    @Field(() => [OfferDto])
    @ApiProperty({
        type: OfferDto,
        isArray: true,
    })
    readonly data: OfferDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: OfferDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
