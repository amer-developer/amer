'use strict';

import { BadRequestException } from '@nestjs/common';

export class UserBlockedException extends BadRequestException {
    constructor(error?: string) {
        super('error.user_blocked', error);
    }
}
