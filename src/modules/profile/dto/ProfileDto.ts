'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { ProfileEntity } from '../profile.entity';

@ObjectType()
export class ProfileDto extends AbstractDto {
    @Field({ nullable: true })
    @ApiPropertyOptional()
    bio: string;

    constructor(profile: ProfileEntity) {
        super(profile);
        this.bio = profile.bio;
    }
}
