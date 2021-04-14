'use strict';

import { BadRequestException } from '@nestjs/common';

export class OtpRetryException extends BadRequestException {
    constructor(error?: string) {
        super('error.otp_retry', error);
    }
}
