import { Injectable, Logger } from '@nestjs/common';
import { FindConditions } from 'typeorm';

import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { ProfileDto } from './dto/profile.dto';
import { ProfilesPageDto } from './dto/profiles-page.dto';
import { ProfilesPageOptionsDto } from './dto/profiles-page.options.dto';
import { ProfileEntity } from './profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
    private logger = new Logger(ProfileService.name);
    constructor(
        public readonly profileRepository: ProfileRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {}

    /**
     * Find single profile
     */
    findOne(findData: FindConditions<ProfileEntity>): Promise<ProfileEntity> {
        return this.profileRepository.findOne(findData);
    }

    async createProfile(profileDto: ProfileDto): Promise<ProfileEntity> {
        const profile = this.profileRepository.create(profileDto);

        return this.profileRepository.save(profile);
    }

    async getProfiles(
        pageOptionsDto: ProfilesPageOptionsDto,
    ): Promise<ProfilesPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        const queryBuilder = this.profileRepository.createQueryBuilder(
            'profile',
        );
        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getProfile(profileId: string) {
        const queryBuilder = this.profileRepository.createQueryBuilder(
            'profile',
        );

        queryBuilder.where('profile.id = :profileId', { profileId });

        const profileEntity = await queryBuilder.getOne();

        return profileEntity.toDto();
    }
}
