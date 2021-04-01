'use strict';
import { Field, ObjectType } from '@nestjs/graphql';

import { AbstractEntity } from '../abstract.entity';
@ObjectType()
export class AbstractDto {
    @Field()
    id: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    constructor(entity: AbstractEntity) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}
