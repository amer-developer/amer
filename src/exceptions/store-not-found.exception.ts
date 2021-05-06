'use strict';

import { NotFoundException } from '@nestjs/common';

export class StoreNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.store_not_found', error);
    }
}
