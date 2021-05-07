'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum StoreStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}

registerEnumType(StoreStatus, {
    name: 'StoreStatus',
});
