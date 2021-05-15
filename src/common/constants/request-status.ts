'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum RequestStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
    DELETED = 'DELETED',
    ACCEPTED_COMPLETED = 'ACCEPTED_COMPLETED',
}

registerEnumType(RequestStatus, {
    name: 'RequestStatus',
});
