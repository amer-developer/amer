import { registerEnumType } from '@nestjs/graphql';

export enum OtpStatus {
    SENT = 'SENT',
    VERIFIED = 'VERIFIED',
    INVALID = 'INVALID',
    EXPIRED = 'EXPIRED',
    TERMINATED = 'TERMINATED',
}

registerEnumType(OtpStatus, {
    name: 'OtpStatus',
});
