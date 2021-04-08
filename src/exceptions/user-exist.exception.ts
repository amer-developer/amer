'use strict';

import { BadRequestException } from '@nestjs/common';

export class UserExistException extends BadRequestException {
    constructor(error?: string) {
        super('error.user_exist', error);
    }
}
