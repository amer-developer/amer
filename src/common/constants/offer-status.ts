'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum OfferStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
    DELETED = 'DELETED',
}

registerEnumType(OfferStatus, {
    name: 'OfferStatus',
});
