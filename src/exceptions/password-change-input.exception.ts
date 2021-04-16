'use strict';

import { BadRequestException } from '@nestjs/common';

export class PasswordChangeInputException extends BadRequestException {
    constructor(error?: string) {
        super('error.password_change_input', error);
    }
}
