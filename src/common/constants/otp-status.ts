import { registerEnumType } from '@nestjs/graphql';

export enum OTPStatus {
    SENT = 'SENT',
    VERIFIED = 'VERIFIED',
    INVALID = 'INVALID',
    EXPIRED = 'EXPIRED',
    TERMINATED = 'TERMINATED',
}

registerEnumType(OTPStatus, {
    name: 'OTPStatus',
});
