'use strict';

import { NotFoundException } from '@nestjs/common';

export class CountryNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.country_not_found', error);
    }
}
