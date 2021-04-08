import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { TranslationService } from '../../shared/services/translation.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UsersPageDto } from './dto/users-page.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(
        private userService: UserService,
        private readonly translationService: TranslationService,
    ) {}

    @Get('admin')
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    async admin(@AuthUser() user: UserEntity): Promise<string> {
        const translation = await this.translationService.translate(
            'keywords.admin',
        );
        return `${translation} ${user.name}`;
    }

    @Get()
    @Auth(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get users list',
        type: UsersPageDto,
    })
    getUsers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<UsersPageDto> {
        return this.userService.getUsers(pageOptionsDto);
    }

    @Get(':id')
    @Auth(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a user',
        type: UserDto,
    })
    getUser(@UUIDParam('id') userId: string): Promise<UserDto> {
        return this.userService.getUser(userId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    updateUser(@Body() user: RegisterDto, @UUIDParam('id') userId: string) {
        return this.userService.updateUser(userId, user);
    }

    @Put('me')
    @Auth(RoleType.USER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    updateCurrentUser(
        @AuthUser() currentUser: UserEntity,
        @Body() user: UpdateUserDto,
    ) {
        return this.userService.updateUser(
            currentUser.id,
            user,
            currentUser.profile?.id,
        );
    }
}
