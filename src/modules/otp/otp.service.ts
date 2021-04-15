import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindManyOptions, In, MoreThanOrEqual } from 'typeorm';

import { OTPReason } from '../../common/constants/otp-reason';
import { OTPStatus } from '../../common/constants/otp-status';
import { OTPMaxAttemptException } from '../../exceptions/otp-attempt.exception';
import { OTPExpiredException } from '../../exceptions/otp-expired.exception';
import { OTPInvalidException } from '../../exceptions/otp-invalid.exception';
import { OTPNotFoundException } from '../../exceptions/otp-not-found.exception';
import { OTPRetryException } from '../../exceptions/otp-retry.exception';
import { SMSService } from '../../modules/sms/sms.service';
import { UtilsService } from '../../providers/utils.service';
import { ConfigService } from '../../shared/services/config.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateOTPDto } from './dto/create-otp.dto';
import { OTPPageOptionsDto } from './dto/otp-page-options.dto';
import { OTPPageDto } from './dto/otp-page.dto';
import { OTPSentRo } from './dto/otp-send.ro';
import { UpdateOTPDto } from './dto/update-otp.dto';
import { ValidateOTPDto } from './dto/validate-otp.dto';
import { OTPEntity } from './otp.entity';
import { OTPRepository } from './otp.repository';

@Injectable()
export class OTPService {
    private logger = new Logger(OTPService.name);
    private maxRetry: number;
    private maxAttempt: number;
    private minBetween: number;
    private expiryMinute: number;

    constructor(
        public readonly otpRepository: OTPRepository,
        public readonly validatorService: ValidatorService,
        public readonly smsService: SMSService,
        private configService: ConfigService,
    ) {
        this.maxRetry = this.configService.getNumber('OTP_MAX_RETRY');
        this.maxAttempt = this.configService.getNumber('OTP_MAX_ATTEMPT');
        this.minBetween = this.configService.getNumber('OTP_MIN_BETWEEN');
        this.expiryMinute = this.configService.getNumber('OTP_MIN_EXPIRY');
    }

    /**
     * Find single otp
     */
    findOne(findData: FindConditions<OTPEntity>): Promise<OTPEntity> {
        return this.otpRepository.findOne(findData);
    }

    /**
     * Find single otp
     */
    find(findData: FindManyOptions<OTPEntity>): Promise<OTPEntity[]> {
        return this.otpRepository.find(findData);
    }

    async sendOTP(otpDto: CreateOTPDto): Promise<OTPSentRo> {
        const previousOTP = await this.isOTOAlreadySent(
            otpDto.phone,
            otpDto.reason,
        );
        const code = String(this.generateRandomOTP());
        if (previousOTP) {
            const currentDate = UtilsService.utcDate(new Date());
            const otpDateAdjusted = previousOTP.updatedAt;
            otpDateAdjusted.setMinutes(
                previousOTP.updatedAt.getMinutes() + this.minBetween,
            );
            this.logger.debug(
                `OTP Date after adding ${otpDateAdjusted.toString()} current date: ${currentDate.toString()}`,
            );
            if (otpDateAdjusted >= currentDate) {
                throw new OTPRetryException();
            }
        }
        const isSMSSent = await this.smsService.sendSMS({
            phone: otpDto.phone,
            body: `Pin Code is: ${code}`,
        });

        if (!isSMSSent) {
            throw new HttpException(
                'Not able to send SMS!',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const otp = this.otpRepository.create({
            ...otpDto,
            code,
            id: previousOTP?.id,
            status: OTPStatus.SENT,
            retry: previousOTP
                ? (previousOTP.retry + 1) % (this.maxRetry + 1)
                : 0,
        });

        const savedEntity = await this.otpRepository.save(otp);

        return new OTPSentRo(
            savedEntity.reason,
            savedEntity.attempt,
            savedEntity.retry,
            savedEntity.phone,
            savedEntity.status,
        );
    }

    async getOTPList(pageOptionsDto: OTPPageOptionsDto): Promise<OTPPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.otpRepository.createQueryBuilder('otp');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'code',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getOTP(id: string) {
        const otpEntity = await this.findOne({ id });

        return otpEntity.toDto();
    }

    async updateOTP(id: string, otp: UpdateOTPDto) {
        const otpEntity = await this.findOne({ id });
        if (!otpEntity) {
            throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
        }

        await this.otpRepository.save({
            id: otpEntity.id,
            ...otp,
        });

        let updatedOTP = otpEntity.toDto();
        updatedOTP = { ...updatedOTP, ...otp };

        return updatedOTP;
    }

    async deleteOTP(id: string) {
        const otpEntity = await this.findOne({ id });
        if (!otpEntity) {
            throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
        }
        await this.otpRepository.delete({
            id: otpEntity.id,
        });
        return otpEntity.toDto();
    }

    public async validateOTP(validateOTP: ValidateOTPDto) {
        const { code, phone, reason } = validateOTP;
        const otp = await this.findOne({
            phone,
            reason,
            status: In([OTPStatus.SENT, OTPStatus.INVALID]),
        });
        this.logger.debug(`Found this otp ${JSON.stringify(otp)}`);
        if (!otp) {
            throw new OTPNotFoundException();
        }
        const currentTime = UtilsService.utcDate(new Date());
        const expiryTime = otp.updatedAt;
        expiryTime.setMinutes(expiryTime.getMinutes() + this.expiryMinute);
        this.logger.debug(`OTP expiry date ${expiryTime.toString()}`);
        this.logger.debug(`Current date ${currentTime.toString()}`);
        if (currentTime > expiryTime) {
            await this.otpRepository.save({
                id: otp.id,
                status: OTPStatus.EXPIRED,
            });
            throw new OTPExpiredException();
        }
        if (otp.attempt >= this.maxAttempt) {
            await this.otpRepository.save({
                id: otp.id,
                status: OTPStatus.TERMINATED,
            });
            throw new OTPMaxAttemptException();
        }
        let updatedOTP = await this.otpRepository.save({
            id: otp.id,
            attempt: otp.attempt + 1,
        });
        if (otp.code !== code) {
            await this.otpRepository.save({
                id: otp.id,
                status:
                    updatedOTP.attempt === this.maxAttempt
                        ? OTPStatus.TERMINATED
                        : OTPStatus.INVALID,
            });
            this.logger.debug(`Updated otp: ${JSON.stringify(updatedOTP)}`);
            if (updatedOTP.attempt === this.maxAttempt) {
                throw new OTPMaxAttemptException();
            }
            throw new OTPInvalidException();
        }
        updatedOTP = await this.otpRepository.save({
            id: otp.id,
            status: OTPStatus.VERIFIED,
        });
        return new OTPSentRo(
            otp.reason,
            updatedOTP.attempt,
            otp.retry,
            otp.phone,
            updatedOTP.status,
        );
    }

    private async isOTOAlreadySent(phone: string, reason: OTPReason) {
        const currentDate = UtilsService.utcDate(new Date());
        currentDate.setHours(0, 0, 0, 0);
        const otp = await this.findOne({
            phone,
            reason,
            status: In([
                OTPStatus.SENT,
                OTPStatus.INVALID,
                OTPStatus.TERMINATED,
                OTPStatus.EXPIRED,
            ]),
            createdAt: MoreThanOrEqual(currentDate),
        });
        if (otp && otp.retry >= this.maxRetry) {
            throw new OTPMaxAttemptException();
        }
        return otp;
    }

    private generateRandomOTP() {
        const isOTPRandomEnabled =
            this.configService.get('OTP_RANDOM_ENABLED') === 'true';
        return isOTPRandomEnabled
            ? Math.floor(1000 + Math.random() * 9000)
            : 1234;
    }
}
