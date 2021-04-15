'use strict';

import { NotFoundException } from '@nestjs/common';

export class OTPNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.otp_not_found', error);
    }
}
