'use strict';

import { NotFoundException } from '@nestjs/common';

export class RequestNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.request_not_found', error);
    }
}
