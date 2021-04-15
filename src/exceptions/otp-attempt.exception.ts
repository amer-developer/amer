'use strict';

import { BadRequestException } from '@nestjs/common';

export class OTPMaxAttemptException extends BadRequestException {
    constructor(error?: string) {
        super('error.otp_max_attempt', error);
    }
}
