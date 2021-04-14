import { registerEnumType } from '@nestjs/graphql';

export enum OtpStatus {
    SENT = 'SENT',
    VERIFIED = 'VERIFIED',
    INVALID = 'INVALID',
    TERMINATED = 'TERMINATED',
}

registerEnumType(OtpStatus, {
    name: 'OtpStatus',
});
