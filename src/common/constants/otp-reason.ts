import { registerEnumType } from '@nestjs/graphql';

export enum OTPReason {
    REGISTER = 'REGISTER',
}

registerEnumType(OTPReason, {
    name: 'OTPReason',
});
