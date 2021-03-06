import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    MinLength,
} from 'class-validator';

import { RoleType } from '../../../common/constants/role-type';
import { UserStatus } from '../../../common/constants/user-status';
import { CreateLocationDto } from '../../location/dto/create-location.dto';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';

@ArgsType()
@InputType()
export class CreateUserDto {
    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    readonly id?: string;

    @Field()
    @ApiProperty({ minLength: 4 })
    @IsString()
    readonly name?: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsString()
    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @Field()
    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    @IsOptional()
    readonly password?: string;

    @Field()
    @ApiProperty()
    @IsPhoneNumber('ZZ')
    phone?: string;

    @Field(() => UserStatus)
    @ApiProperty({
        required: true,
        enum: UserStatus,
        default: UserStatus.INACTIVE,
    })
    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;

    @Field(() => RoleType, { nullable: true })
    @ApiProperty({
        required: true,
        enum: RoleType,
        default: RoleType.BUYER,
    })
    @IsEnum(RoleType)
    @IsOptional()
    role?: RoleType;

    @Field(() => CreateProfileDto, { nullable: true })
    @ApiProperty({ required: false, type: () => CreateProfileDto })
    @IsOptional()
    @IsObject()
    profile?: CreateProfileDto;

    @Field(() => CreateLocationDto, { nullable: true })
    @ApiProperty({ required: false, type: () => CreateLocationDto })
    @IsOptional()
    @Type(() => CreateLocationDto)
    @IsObject({ each: true })
    location?: CreateLocationDto;
}
