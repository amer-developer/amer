import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { UserDto } from './user.dto';

@ObjectType()
export class UsersPageDto {
    @Field(() => [UserDto])
    @ApiProperty({
        type: UserDto,
        isArray: true,
    })
    readonly data: UserDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: UserDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
