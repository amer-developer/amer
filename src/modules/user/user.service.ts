import { Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindOneOptions } from 'typeorm';

import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { IFile } from '../../interfaces/IFile';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UsersPageDto } from './dto/users-page.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    private logger = new Logger(UserService.name);
    constructor(
        public readonly userRepository: UserRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {}

    /**
     * Find single user
     */
    findOne(
        findData: FindConditions<UserEntity>,
        findOpts?: FindOneOptions<UserEntity>,
    ): Promise<UserEntity> {
        return this.userRepository.findOne(findData, findOpts);
    }

    async findByUsernameOrEmail(
        options: Partial<{ username: string; email: string }>,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }
        if (options.username) {
            queryBuilder.orWhere('user.username = :username', {
                username: options.username,
            });
        }

        return queryBuilder.getOne();
    }

    async createUser(
        userRegisterDto: RegisterDto,
        file: IFile,
    ): Promise<UserEntity> {
        const user = this.userRepository.create(userRegisterDto);

        if (file && !this.validatorService.isImage(file.mimetype)) {
            throw new FileNotImageException();
        }

        if (file) {
            user.profile.avatar = await this.awsS3Service.uploadImage(file);
        }

        return this.userRepository.save(user);
    }

    async updateUser(id: string, user: UpdateUserDto, profileID?: string) {
        this.logger.debug(`Updating user: ${id} to ${JSON.stringify(user)}`);
        const profile = profileID
            ? { id: profileID, ...user.profile }
            : { ...user.profile };
        delete user.profile;
        return this.userRepository.save({
            id,
            profile,
            ...user,
        });
    }

    async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<UsersPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getUser(userId: string) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        queryBuilder.where('user.id = :userId', { userId });

        const userEntity = await queryBuilder.getOne();

        return userEntity.toDto();
    }
}
