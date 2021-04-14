'use strict';

import { BadRequestException } from '@nestjs/common';

export class OtpExpiredException extends BadRequestException {
    constructor(error?: string) {
        super('error.otp_expired', error);
    }
}
