'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum SubCategoryStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}

registerEnumType(SubCategoryStatus, {
    name: 'SubCategoryStatus',
});
