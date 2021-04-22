import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordRo } from './dto/change-password.ro';
import { LoginDto } from './dto/login.dto';
import { LoginRo } from './dto/login.ro';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRo } from './dto/reset-password.ro';

@Resolver(() => UserDto)
export class AuthResolver {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
    ) {}

    @Mutation(() => LoginRo, { name: 'login' })
    async userLogin(@Args() userLoginDto: LoginDto): Promise<LoginRo> {
        const userEntity = await this.authService.validateUser(userLoginDto);

        const token = await this.authService.createToken(userEntity);
        return new LoginRo(userEntity.toDto(), token);
    }

    @Mutation(() => LoginRo, { name: 'register' })
    async userRegister(@Args() userRegisterDto: RegisterDto): Promise<LoginRo> {
        const createdUser = await this.userService.createUser(userRegisterDto);

        const token = await this.authService.createToken(createdUser);
        return new LoginRo(createdUser.toDto(), token);
    }

    @Mutation(() => ResetPasswordRo, { name: 'resetPassword' })
    async resetPassword(
        @Args() resetPasswordDto: ResetPasswordDto,
    ): Promise<ResetPasswordRo> {
        return this.userService.resetPassword(resetPasswordDto);
    }

    @Mutation(() => ChangePasswordRo, { name: 'changePassword' })
    async changePassword(
        @Args() changePasswordDto: ChangePasswordDto,
    ): Promise<ChangePasswordRo> {
        return this.authService.changePassword(changePasswordDto);
    }

    @Query(() => UserDto, { name: 'me' })
    @Auth(RoleType.ADMIN, RoleType.BUYER)
    getCurrentUser(@AuthUser() user: UserEntity) {
        return user.toDto();
    }
}
