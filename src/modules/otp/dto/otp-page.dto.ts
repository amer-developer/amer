import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { OtpDto } from './otp.dto';

@ObjectType()
export class OtpPageDto {
    @Field(() => [OtpDto])
    @ApiProperty({
        type: OtpDto,
        isArray: true,
    })
    readonly data: OtpDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: OtpDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
