import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { ProfileDto } from './ProfileDto';

@ObjectType()
export class ProfilesPageDto {
    @Field(() => [ProfileDto])
    @ApiProperty({
        type: ProfileDto,
        isArray: true,
    })
    readonly data: ProfileDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: ProfileDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
