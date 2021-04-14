import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OtpReason } from '../../common/constants/otp-reason';
import { OtpStatus } from '../../common/constants/otp-status';
import { OtpDto } from './dto/otp.dto';

@Entity({ name: 'otp' })
export class OtpEntity extends AbstractEntity<OtpDto> {
    @Column({ nullable: false })
    code: string;

    @Column({ type: 'enum', enum: OtpReason, nullable: true })
    reason: OtpReason;

    @Column({ nullable: false, default: 0 })
    attempt: number;

    @Column({ nullable: false, default: 0 })
    retry: number;

    @Column({
        type: 'enum',
        enum: OtpStatus,
        nullable: false,
    })
    status: OtpStatus;

    @Column({ nullable: false })
    phone: string;

    dtoClass = OtpDto;
}
