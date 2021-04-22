import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from 'class-validator';

@ArgsType()
export class ChangePasswordDto {
    @Field()
    @ApiProperty({ required: true })
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otp: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    oldPassword: string;

    @Field()
    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    readonly password: string;
}
