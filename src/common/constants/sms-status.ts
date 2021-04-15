import { registerEnumType } from '@nestjs/graphql';

export enum SMSStatus {
    INITIATED = 'INITIATED',
    SENT = 'SENT',
    FAILED = 'FAILED',
}

registerEnumType(SMSStatus, {
    name: 'SMSStatus',
});
