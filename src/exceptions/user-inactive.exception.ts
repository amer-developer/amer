'use strict';

import { BadRequestException } from '@nestjs/common';

export class UserInactiveException extends BadRequestException {
    constructor(error?: string) {
        super('error.user_inactive', error);
    }
}
