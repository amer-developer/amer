import { Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindOneOptions, Not } from 'typeorm';

import { OTPReason } from '../../common/constants/otp-reason';
import { RoleType } from '../../common/constants/role-type';
import { UserStatus } from '../../common/constants/user-status';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { UserExistException } from '../../exceptions/user-exist.exception';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { ValidatorService } from '../../shared/services/validator.service';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { ChangePasswordRo } from '../auth/dto/change-password.ro';
import { RegisterDto } from '../auth/dto/register.dto';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto';
import { ResetPasswordRo } from '../auth/dto/reset-password.ro';
import { LocationService } from '../location/location.service';
import { OTPService } from '../otp/otp.service';
import { ProfileService } from '../profile/profile.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ActivateUserRO } from './dto/activate-user.ro';
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
        public readonly profileService: ProfileService,
        public readonly locationService: LocationService,
        public readonly otpService: OTPService,
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
        queryBuilder.andWhere('user.status != :status', {
            status: UserStatus.DELETED,
        });

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
        let location, profile;
        if (userRegisterDto.location) {
            location = await this.locationService.createLocation(
                userRegisterDto.location,
            );
            delete userRegisterDto.location;
        }
        if (userRegisterDto.profile) {
            profile = await this.profileService.createProfile(
                userRegisterDto.profile,
            );
            delete userRegisterDto.profile;
        }

        const user = this.userRepository.create({
            location,
            profile,
            ...userRegisterDto,
        });

        return this.userRepository.save(user);
    }

    sendOtp(phone: string, reason: OTPReason) {
        return this.otpService.sendOTP({
            phone,
            reason,
        });
    }

    async updateUser(id: string, updatedUser: UpdateUserDto) {
        this.logger.debug(
            `Updating user: ${id} to ${JSON.stringify(updatedUser)}`,
        );
        const user = await this.findOne(
            { id },
            {
                relations: [
                    'profile',
                    'location',
                    'location.country',
                    'location.city',
                    'location.district',
                ],
            },
        );
        this.logger.debug(`Current user: ${JSON.stringify(user)}`);
        let profile, location;
        if (!user) {
            throw new UserNotFoundException();
        }
        if (updatedUser.profile) {
            profile = await this.profileService.createProfile(
                updatedUser.profile,
                user.profile?.id,
            );
            delete updatedUser.profile;
        }
        if (updatedUser.location) {
            location = await this.locationService.createLocation(
                updatedUser.location,
                user.location?.id,
            );
            delete updatedUser.location;
        }
        return this.userRepository.save({
            id,
            profile,
            location,
            ...updatedUser,
        });
    }

    async activateUser(activateDto: ActivateUserDto) {
        this.logger.debug(`Activate user: ${activateDto.phone}`);
        const user = await this.findOne({
            phone: activateDto.phone,
            status: Not(UserStatus.DELETED),
        });
        this.logger.debug(`User: ${JSON.stringify(user)}`);
        if (!user) {
            throw new UserNotFoundException();
        }
        const otp = await this.otpService.validateOTP({
            phone: activateDto.phone,
            code: activateDto.otp,
            reason: OTPReason.REGISTER,
        });
        await this.userRepository.save({
            id: user.id,
            status: UserStatus.ACTIVE,
        });
        user.status = UserStatus.ACTIVE;
        return new ActivateUserRO(user.toDto(), otp);
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

    async getUser(id: string, options?: GetOptionsDto) {
        const userEntity = await this.findOne(
            { id },
            { relations: options.includes },
        );
        if (!userEntity) {
            throw new UserNotFoundException();
        }

        return userEntity.toDto();
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const userEntity = await this.findOne({
            phone: resetPasswordDto.phone,
            status: Not(UserStatus.DELETED),
        });
        if (!userEntity) {
            throw new UserNotFoundException();
        }

        await this.otpService.sendOTP({
            phone: resetPasswordDto.phone,
            reason: OTPReason.RESET_PASSWORD,
        });

        return new ResetPasswordRo('password.reset', resetPasswordDto.phone);
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const userEntity = await this.findOne({
            phone: changePasswordDto.phone,
            status: Not(UserStatus.DELETED),
        });
        if (!userEntity) {
            throw new UserNotFoundException();
        }

        let otp;

        if (changePasswordDto.otp) {
            otp = await this.otpService.validateOTP({
                code: changePasswordDto.otp,
                phone: changePasswordDto.phone,
                reason: OTPReason.RESET_PASSWORD,
            });
        }

        await this.userRepository.save({
            id: userEntity.id,
            password: changePasswordDto.password,
        });

        return new ChangePasswordRo(
            'password.changed',
            changePasswordDto.password,
            otp,
        );
    }

    async deleteUser(id: string) {
        const userEntity = await this.findOne({ id });
        if (!userEntity) {
            throw new UserNotFoundException();
        }
        userEntity.status = UserStatus.DELETED;
        await this.userRepository.save({
            id: userEntity.id,
            status: UserStatus.DELETED,
        });
        return userEntity.toDto();
    }
}
