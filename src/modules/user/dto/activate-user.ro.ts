import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { OTPSentRo } from '../../otp/dto/otp-send.ro';
import { UserDto } from './user.dto';

@ObjectType()
export class ActivateUserRO {
    @Field(() => UserDto)
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @Field(() => OTPSentRo)
    @ApiProperty({ type: OTPSentRo })
    otp: OTPSentRo;

    constructor(user: UserDto, otp: OTPSentRo) {
        this.user = user;
        this.otp = otp;
    }
}
