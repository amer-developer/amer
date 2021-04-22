import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from 'class-validator';

import { UserStatus } from '../../../common/constants/user-status';
import { CreateLocationDto } from '../../location/dto/create-location.dto';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';

@ArgsType()
export class CreateUserDto {
    @Field()
    @ApiProperty({ minLength: 4 })
    @IsString()
    readonly name: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
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
    phone: string;

    @Field(() => UserStatus)
    @ApiProperty({
        required: true,
        enum: UserStatus,
        default: UserStatus.INACTIVE,
    })
    @IsOptional()
    status: UserStatus;

    @Field(() => CreateProfileDto, { nullable: true })
    @ApiProperty({ required: false, type: () => CreateProfileDto })
    @IsOptional()
    @IsObject()
    profile: CreateProfileDto;

    @Field(() => CreateLocationDto, { nullable: true })
    @ApiProperty({ required: false, type: () => CreateLocationDto })
    @IsOptional()
    @Type(() => CreateLocationDto)
    @IsObject({ each: true })
    location: CreateLocationDto;
}
