'use strict';

import { NotFoundException } from '@nestjs/common';

export class OfferNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.offer_not_found', error);
    }
}
