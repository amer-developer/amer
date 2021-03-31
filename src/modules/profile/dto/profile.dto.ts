'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ProfileEntity } from '../profile.entity';

@ObjectType()
export class ProfileDto extends AbstractDto {
    @Field({ nullable: true })
    @ApiProperty()
    @IsOptional()
    bio: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    avatar: string;

    constructor(profile: ProfileEntity) {
        super(profile);
        this.bio = profile.bio;
        this.avatar = profile.avatar;
    }
}
