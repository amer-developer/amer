'use strict';

import { NotFoundException } from '@nestjs/common';

export class SubCategoryNotFoundException extends NotFoundException {
    constructor(error?: string) {
        super('error.sub_category_not_found', error);
    }
}
