'use strict';

import { BadRequestException } from '@nestjs/common';

export class OTPRetryException extends BadRequestException {
    constructor(error?: string) {
        super('error.otp_retry', error);
    }
}
