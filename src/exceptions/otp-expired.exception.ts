'use strict';

import { BadRequestException } from '@nestjs/common';

export class OTPExpiredException extends BadRequestException {
    constructor(error?: string) {
        super('error.otp_expired', error);
    }
}
