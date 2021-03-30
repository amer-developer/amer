import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { Query as GLQuery } from '@nestjs/graphql';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { TranslationService } from '../../shared/services/translation.service';
import { UserDto } from './dto/UserDto';
import { UsersPageDto } from './dto/UsersPageDto';
import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
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
        return `${translation} ${user.firstName}`;
    }

    @Get()
    @Auth(RoleType.USER)
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
    @GLQuery(() => UserDto)
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a user',
        type: UserDto,
    })
    getUser(@UUIDParam('id') userId: string): Promise<UserDto> {
        return this.userService.getUser(userId);
    }
}
