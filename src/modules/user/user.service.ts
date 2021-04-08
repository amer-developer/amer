import { Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindOneOptions } from 'typeorm';

import { RoleType } from '../../common/constants/role-type';
import { UserExistException } from '../../exceptions/user-exist.exception';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
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

    async findByPhoneOrEmail(
        options: Partial<{ phone: string; email: string }>,
        role?: RoleType,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }
        if (options.phone) {
            queryBuilder.orWhere('user.phone = :phone', {
                phone: options.phone,
            });
        }
        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }

        return queryBuilder.getOne();
    }

    async createUser(userRegisterDto: RegisterDto): Promise<UserEntity> {
        const checkExist = await this.findByPhoneOrEmail({
            phone: userRegisterDto.phone,
            email: userRegisterDto.email,
        });
        if (checkExist) {
            throw new UserExistException();
        }
        const user = this.userRepository.create(userRegisterDto);

        return this.userRepository.save(user);
    }

    async updateUser(
        id: string,
        updatedUser: UpdateUserDto,
        profileID?: string,
    ) {
        this.logger.debug(
            `Updating user: ${id} to ${JSON.stringify(updatedUser)}`,
        );
        const user = await this.findOne({ id }, { relations: ['profile'] });
        if (!user) {
            throw new UserNotFoundException();
        }
        if (!profileID) {
            profileID = user.profile.id;
        }
        const profile = profileID
            ? { id: profileID, ...updatedUser.profile }
            : { ...updatedUser.profile };
        delete updatedUser.profile;
        return this.userRepository.save({
            id,
            profile,
            ...user,
        });
    }

    async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<UsersPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.userRepository.createQueryBuilder('user');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'name',
                'email',
                'phone',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getUser(id: string) {
        const userEntity = await this.findOne({ id });
        if (!userEntity) {
            throw new UserNotFoundException();
        }

        return userEntity.toDto();
    }
}
