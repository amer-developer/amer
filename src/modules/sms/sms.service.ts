import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { FindConditions, FindManyOptions } from 'typeorm';

import { SMSStatus } from '../../common/constants/sms-status';
import { SMSNotFoundException } from '../../exceptions/sms-not-found.exception';
import { ExternalSMSService } from '../../shared/services/sms.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateSMSDto } from './dto/create-sms.dto';
import { SMSPageOptionsDto } from './dto/sms-page-options.dto';
import { SMSPageDto } from './dto/sms-page.dto';
import { SMSSentRo } from './dto/sms-send.ro';
import { UpdateSMSDto } from './dto/update-sms.dto';
import { SMSEntity } from './sms.entity';
import { SMSRepository } from './sms.repository';

@Injectable()
export class SMSService {
    private logger = new Logger(SMSService.name);

    constructor(
        public readonly smsRepository: SMSRepository,
        public readonly validatorService: ValidatorService,
        @Inject(forwardRef(() => ExternalSMSService))
        public readonly smsService: ExternalSMSService,
    ) {}

    /**
     * Find single sms
     */
    findOne(findData: FindConditions<SMSEntity>): Promise<SMSEntity> {
        return this.smsRepository.findOne(findData);
    }

    /**
     * Find single sms
     */
    find(findData: FindManyOptions<SMSEntity>): Promise<SMSEntity[]> {
        return this.smsRepository.find(findData);
    }

    async sendSMS(smsDto: CreateSMSDto): Promise<SMSSentRo> {
        const sms = this.smsRepository.create({
            ...smsDto,
        });

        const savedEntity = await this.smsRepository.save(sms);

        const isSMSSent = await this.smsService.sendSMS(
            smsDto.phone,
            smsDto.body,
        );

        await this.smsRepository.save({
            id: savedEntity.id,
            status: isSMSSent ? SMSStatus.SENT : SMSStatus.FAILED,
        });

        if (!isSMSSent) {
            throw new HttpException(
                'Not able to send SMS!',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return new SMSSentRo(
            savedEntity.phone,
            savedEntity.body,
            savedEntity.status,
        );
    }

    async getSMSList(pageOptionsDto: SMSPageOptionsDto): Promise<SMSPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.smsRepository.createQueryBuilder('sms');

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

    async getSMS(id: string) {
        const smsEntity = await this.findOne({ id });

        if (!smsEntity) {
            throw new SMSNotFoundException();
        }

        return smsEntity.toDto();
    }

    async updateSMS(id: string, sms: UpdateSMSDto) {
        const smsEntity = await this.findOne({ id });
        if (!smsEntity) {
            throw new HttpException('SMS not found', HttpStatus.NOT_FOUND);
        }

        await this.smsRepository.save({
            id: smsEntity.id,
            ...sms,
        });

        let updatedSMS = smsEntity.toDto();
        updatedSMS = { ...updatedSMS, ...sms };

        return updatedSMS;
    }

    async deleteSMS(id: string) {
        const smsEntity = await this.findOne({ id });
        if (!smsEntity) {
            throw new HttpException('SMS not found', HttpStatus.NOT_FOUND);
        }
        await this.smsRepository.delete({
            id: smsEntity.id,
        });
        return smsEntity.toDto();
    }
}
