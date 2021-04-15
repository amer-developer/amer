'use strict';

import { NotFoundException } from '@nestjs/common';

export class SMSNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.sms_not_found', error);
    }
}
