'use strict';

import { BadRequestException } from '@nestjs/common';

export class OtpMaxAttemptException extends BadRequestException {
    constructor(error?: string) {
        super('error.otp_max_attempt', error);
    }
}
