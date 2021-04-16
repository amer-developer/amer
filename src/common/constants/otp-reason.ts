import { registerEnumType } from '@nestjs/graphql';

export enum OTPReason {
    REGISTER = 'REGISTER',
    RESET_PASSWORD = 'RESET_PASSWORD',
}

registerEnumType(OTPReason, {
    name: 'OTPReason',
});
