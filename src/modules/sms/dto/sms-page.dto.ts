import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { SMSDto } from './sms.dto';

@ObjectType()
export class SMSPageDto {
    @Field(() => [SMSDto])
    @ApiProperty({
        type: SMSDto,
        isArray: true,
    })
    readonly data: SMSDto[];

    @Field(() => PageMetaDto)
    @ApiProperty()
    readonly meta: PageMetaDto;

    constructor(data: SMSDto[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
