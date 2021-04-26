'use strict';

import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
    DELETED = 'DELETED',
}

registerEnumType(UserStatus, {
    name: 'UserStatus',
});
