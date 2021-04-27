import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Not } from 'typeorm';

import { UserStatus } from '../../common/constants/user-status';
import { PasswordChangeInputException } from '../../exceptions/password-change-input.exception';
import { UserBlockedException } from '../../exceptions/user-blocked.exception';
import { UserInactiveException } from '../../exceptions/user-inactive.exception';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UtilsService } from '../../providers/utils.service';
import { ConfigService } from '../../shared/services/config.service';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { TokenRo } from './dto/token.ro';

@Injectable()
export class AuthService {
    constructor(
        public readonly jwtService: JwtService,
        public readonly configService: ConfigService,
        public readonly userService: UserService,
    ) {}

    async createToken(user: UserEntity | UserDto): Promise<TokenRo> {
        return new TokenRo({
            expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this.jwtService.signAsync({ id: user.id }),
        });
    }

    async validateUser(userLoginDto: LoginDto): Promise<UserEntity> {
        const user = await this.userService.findOne(
            {
                phone: userLoginDto.phone,
                status: Not(UserStatus.DELETED),
            },
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
        const isPasswordValid = await UtilsService.validateHash(
            userLoginDto.password,
            user && user.password,
        );
        if (!user || !isPasswordValid) {
            throw new UserNotFoundException();
        }
        if (user.status === UserStatus.INACTIVE) {
            throw new UserInactiveException();
        }
        if (user.status === UserStatus.BLOCKED) {
            throw new UserBlockedException();
        }
        return user;
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const { oldPassword, otp, phone } = changePasswordDto;
        if ((oldPassword && otp) || (!oldPassword && !otp)) {
            throw new PasswordChangeInputException();
        }
        const userEntity = await this.userService.findOne({
            phone,
            status: Not(UserStatus.DELETED),
        });
        if (!userEntity) {
            throw new UserNotFoundException();
        }

        if (changePasswordDto.oldPassword) {
            await this.validateUser({
                phone,
                password: changePasswordDto.oldPassword,
            });
        }

        return this.userService.changePassword(changePasswordDto);
    }
}
