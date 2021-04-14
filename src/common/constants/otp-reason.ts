import { registerEnumType } from '@nestjs/graphql';

export enum OtpReason {
    REGISTER = 'REGISTER',
}

registerEnumType(OtpReason, {
    name: 'OtpReason',
});
