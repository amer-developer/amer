import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UtilsService } from '../../providers/utils.service';
import { ConfigService } from '../../shared/services/config.service';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
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
            },
            { relations: ['profile'] },
        );
        const isPasswordValid = await UtilsService.validateHash(
            userLoginDto.password,
            user && user.password,
        );
        if (!user || !isPasswordValid) {
            throw new UserNotFoundException();
        }
        return user;
    }
}
