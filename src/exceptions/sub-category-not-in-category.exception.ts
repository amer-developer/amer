'use strict';

import { BadRequestException } from '@nestjs/common';

export class SubCategoryNotInCategoryException extends BadRequestException {
    constructor(error?: string) {
        super('error.subcategory_not_in_category', error);
    }
}
