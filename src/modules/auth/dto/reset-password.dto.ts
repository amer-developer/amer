import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

@ArgsType()
export class ResetPasswordDto {
    @Field()
    @ApiProperty({ required: true })
    @IsPhoneNumber('ZZ')
    phone: string;
}
