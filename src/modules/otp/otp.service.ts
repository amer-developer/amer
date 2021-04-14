import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindManyOptions, In } from 'typeorm';

import { OtpStatus } from '../../common/constants/otp-status';
import { OtpInvalidException } from '../../exceptions/otp-invalid.exception';
import { OtpNotFoundException } from '../../exceptions/otp-not-found.exception';
import { ConfigService } from '../../shared/services/config.service';
import { SMSService } from '../../shared/services/sms.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { OtpPageOptionsDto } from './dto/otp-page-options.dto';
import { OtpPageDto } from './dto/otp-page.dto';
import { OtpSentRo } from './dto/otp-send.ro';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { OtpEntity } from './otp.entity';
import { OtpRepository } from './otp.repository';

@Injectable()
export class OtpService {
    private logger = new Logger(OtpService.name);
    constructor(
        public readonly otpRepository: OtpRepository,
        public readonly validatorService: ValidatorService,
        public readonly smsService: SMSService,
        private configService: ConfigService,
    ) {}

    /**
     * Find single otp
     */
    findOne(findData: FindConditions<OtpEntity>): Promise<OtpEntity> {
        return this.otpRepository.findOne(findData);
    }

    /**
     * Find single otp
     */
    find(findData: FindManyOptions<OtpEntity>): Promise<OtpEntity[]> {
        return this.otpRepository.find(findData);
    }

    async sendOtp(otpDto: CreateOtpDto): Promise<OtpSentRo> {
        const code = String(this.generateRandomOTP());
        const isSMSSent = await this.smsService.sendSMS(
            otpDto.phone,
            `Pin Code is: ${code}`,
        );

        if (!isSMSSent) {
            throw new HttpException(
                'Not able to send SMS!',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const otp = this.otpRepository.create({
            ...otpDto,
            code,
            status: OtpStatus.SENT,
        });

        const savedEntity = await this.otpRepository.save(otp);

        return new OtpSentRo(
            savedEntity.reason,
            savedEntity.attempt,
            savedEntity.retry,
            savedEntity.phone,
            savedEntity.status,
        );
    }

    async getOtpList(pageOptionsDto: OtpPageOptionsDto): Promise<OtpPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.otpRepository.createQueryBuilder('otp');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'nameAR',
                'nameEN',
                'code',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getOtp(id: string) {
        const otpEntity = await this.findOne({ id });

        return otpEntity.toDto();
    }

    async updateOtp(id: string, otp: UpdateOtpDto) {
        const otpEntity = await this.findOne({ id });
        if (!otpEntity) {
            throw new HttpException('Otp not found', HttpStatus.NOT_FOUND);
        }

        await this.otpRepository.save({
            id: otpEntity.id,
            ...otp,
        });

        let updatedOtp = otpEntity.toDto();
        updatedOtp = { ...updatedOtp, ...otp };

        return updatedOtp;
    }

    async deleteOtp(id: string) {
        const otpEntity = await this.findOne({ id });
        if (!otpEntity) {
            throw new HttpException('Otp not found', HttpStatus.NOT_FOUND);
        }
        await this.otpRepository.delete({
            id: otpEntity.id,
        });
        return otpEntity.toDto();
    }

    public async validateOTP(validateOTP: ValidateOtpDto) {
        const { code, phone, reason } = validateOTP;
        const otp = await this.findOne({
            phone,
            reason,
            status: In([OtpStatus.SENT, OtpStatus.INVALID]),
        });
        this.logger.debug(`Found this otp ${JSON.stringify(otp)}`);
        if (!otp) {
            throw new OtpNotFoundException();
        }
        let updatedOtp = await this.otpRepository.save({
            id: otp.id,
            attempt: otp.attempt + 1,
        });
        if (otp.code !== code) {
            updatedOtp = await this.otpRepository.save({
                id: otp.id,
                status: OtpStatus.INVALID,
            });
            throw new OtpInvalidException();
        }
        updatedOtp = await this.otpRepository.save({
            id: otp.id,
            status: OtpStatus.VERIFIED,
        });
        return new OtpSentRo(
            otp.reason,
            updatedOtp.attempt,
            otp.retry,
            otp.phone,
            updatedOtp.status,
        );
    }

    private generateRandomOTP() {
        const isOTPRandomEnabled =
            this.configService.get('OTP_RANDOM_ENABLED') === 'true';
        return isOTPRandomEnabled
            ? Math.floor(1000 + Math.random() * 9000)
            : 1234;
    }
}
