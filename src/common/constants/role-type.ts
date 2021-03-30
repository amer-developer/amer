'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum RoleType {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

registerEnumType(RoleType, {
    name: 'RoleType',
});
