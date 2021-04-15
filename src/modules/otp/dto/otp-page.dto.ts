import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { OTPDto } from './otp.dto';

@ObjectType()
export class OTPPageDto {
    @Field(() => [OTPDto])
    @ApiProperty({
        type: OTPDto,
        isArray: true,
    })
    readonly data: OTPDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: OTPDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
