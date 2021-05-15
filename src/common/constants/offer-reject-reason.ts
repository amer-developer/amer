'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum OfferRejectReason {
    TOO_HIGH = 'TOO_HIGH',
}

registerEnumType(OfferRejectReason, {
    name: 'OfferRejectReason',
});
