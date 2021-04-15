'use strict';

import { BadRequestException } from '@nestjs/common';

export class OTPInvalidException extends BadRequestException {
    constructor(error?: string) {
        super('error.otp_invalid', error);
    }
}
