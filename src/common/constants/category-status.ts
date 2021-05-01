'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}

registerEnumType(CategoryStatus, {
    name: 'CategoryStatus',
});
