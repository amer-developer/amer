import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from 'class-validator';

import { CreateProfileDto } from '../../profile/dto/create-profile.dto';

// import { Trim } from '../../../decorators/transforms.decorator';

@ArgsType()
export class RegisterDto {
    @Field()
    @ApiProperty({ minLength: 4 })
    @IsString()
    readonly name: string;

    @Field({ nullable: true })
    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsOptional()
    readonly email: string;

    @Field()
    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    readonly password: string;

    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    @IsOptional()
    phone: string;

    @Field(() => CreateProfileDto, { nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    profile: CreateProfileDto;
}
