'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsObject,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

import { RoleType } from '../../../common/constants/role-type';
import { UserStatus } from '../../../common/constants/user-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ProfileDto } from '../../profile/dto/profile.dto';
import { UserEntity } from '../user.entity';

@ObjectType()
export class UserDto extends AbstractDto {
    @Field()
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name: string;

    @Field(() => RoleType)
    @ApiProperty({ required: false, enum: RoleType })
    @IsOptional()
    role: RoleType;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @Field()
    @ApiProperty({ required: false })
    @IsOptional()
    @IsPhoneNumber('ZZ')
    phone: string;

    @Field(() => UserStatus)
    @ApiProperty({ required: true, enum: UserStatus })
    status: UserStatus;

    @Field(() => ProfileDto, { nullable: true })
    @ApiProperty({ required: false, type: () => ProfileDto })
    @IsOptional()
    @IsObject()
    profile: ProfileDto;

    constructor(user: UserEntity) {
        super(user);
        this.name = user.name;
        this.role = user.role;
        this.email = user.email;
        this.phone = user.phone;
        this.status = user.status;
        if (user.profile) {
            this.profile = user.profile.toDto();
        }
    }
}
