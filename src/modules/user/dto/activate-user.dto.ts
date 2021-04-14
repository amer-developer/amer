import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

@ArgsType()
export class ActivateUserDto {
    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field()
    @ApiProperty({ minLength: 4, maxLength: 4 })
    @MinLength(4)
    @MaxLength(4)
    @IsString()
    readonly otp: string;
}
