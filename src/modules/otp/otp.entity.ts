import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OTPReason } from '../../common/constants/otp-reason';
import { OTPStatus } from '../../common/constants/otp-status';
import { OTPDto } from './dto/otp.dto';

@Entity({ name: 'otp' })
export class OTPEntity extends AbstractEntity<OTPDto> {
    @Column({ nullable: false })
    code: string;

    @Column({ type: 'enum', enum: OTPReason, nullable: true })
    reason: OTPReason;

    @Column({ nullable: false, default: 0 })
    attempt: number;

    @Column({ nullable: false, default: 0 })
    retry: number;

    @Column({
        type: 'enum',
        enum: OTPStatus,
        nullable: false,
    })
    status: OTPStatus;

    @Column({ nullable: false })
    phone: string;

    dtoClass = OTPDto;
}
