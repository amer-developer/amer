'use strict';

import { BadRequestException } from '@nestjs/common';

export class OtpInvalidException extends BadRequestException {
    constructor(error?: string) {
        super('error.otp_invalid', error);
    }
}
