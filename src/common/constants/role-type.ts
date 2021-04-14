'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum RoleType {
    BUYER = 'BUYER',
    SELLER = 'SELLER',
    ADMIN = 'ADMIN',
}

registerEnumType(RoleType, {
    name: 'RoleType',
});
