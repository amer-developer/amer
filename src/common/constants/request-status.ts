'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum RequestStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
    DELETED = 'DELETED',
}

registerEnumType(RequestStatus, {
    name: 'RequestStatus',
});
