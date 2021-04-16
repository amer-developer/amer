import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
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

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginRo,
        description: 'User info with access token',
    })
    async userLogin(@Body() userLoginDto: LoginDto): Promise<LoginRo> {
        const userEntity = await this.authService.validateUser(userLoginDto);

        const token = await this.authService.createToken(userEntity);
        return new LoginRo(userEntity.toDto(), token);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
    async userRegister(@Body() userRegisterDto: RegisterDto): Promise<UserDto> {
        const createdUser = await this.userService.createUser(userRegisterDto);

        return createdUser.toDto();
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: ResetPasswordRo,
        description: 'Successfully reseted',
    })
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<ResetPasswordRo> {
        return this.userService.resetPassword(resetPasswordDto);
    }

    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: ChangePasswordRo,
        description: 'Successfully changed password',
    })
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<ChangePasswordRo> {
        return this.authService.changePassword(changePasswordDto);
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto, description: 'current user info' })
    async getCurrentUser(@AuthUser() user: UserEntity) {
        const currentUser = await this.userService.findOne(
            { id: user.id },
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
        return currentUser.toDto();
    }
}
