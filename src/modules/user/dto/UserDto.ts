'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { RoleType } from '../../../common/constants/role-type';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { UserEntity } from '../user.entity';

@ObjectType()
export class UserDto extends AbstractDto {
    @Field()
    @ApiPropertyOptional()
    firstName: string;

    @Field()
    @ApiPropertyOptional()
    lastName: string;

    @Field()
    @ApiPropertyOptional()
    username: string;

    @Field()
    @ApiPropertyOptional({ enum: RoleType })
    role: RoleType;

    @Field()
    @ApiPropertyOptional()
    email: string;

    @Field()
    @ApiPropertyOptional()
    avatar: string;

    @Field()
    @ApiPropertyOptional()
    phone: string;

    constructor(user: UserEntity) {
        super(user);
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = user.role;
        this.email = user.email;
        this.avatar = user.avatar;
        this.phone = user.phone;
    }
}
