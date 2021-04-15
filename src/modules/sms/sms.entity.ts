import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { SMSStatus } from '../../common/constants/sms-status';
import { SMSDto } from './dto/sms.dto';

@Entity({ name: 'sms' })
export class SMSEntity extends AbstractEntity<SMSDto> {
    @Column({ nullable: false })
    body: string;

    @Column({
        type: 'enum',
        enum: SMSStatus,
        default: SMSStatus.INITIATED,
        nullable: false,
    })
    status: SMSStatus;

    @Column({ nullable: false })
    phone: string;

    dtoClass = SMSDto;
}
