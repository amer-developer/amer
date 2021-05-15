'use strict';

import { BadRequestException } from '@nestjs/common';

export class OfferNotValidException extends BadRequestException {
    constructor(error?: string) {
        super('error.offer_not_valid_anymore', error);
    }
}
