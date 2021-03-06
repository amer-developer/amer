import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
    Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ActivateUserRO } from './dto/activate-user.ro';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UsersPageDto } from './dto/users-page.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
    private logger = new Logger(UserController.name);
    constructor(private userService: UserService) {}

    @Post('')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDto,
        description: 'Successfully Created',
    })
    async userRegister(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        const createdUser = await this.userService.createUserFromDto(
            createUserDto,
        );
        return createdUser.toDto();
    }

    @Get()
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
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a user',
        type: UserDto,
    })
    getUser(
        @UUIDParam('id') userId: string,
        @Query(new ValidationPipe({ transform: true }))
        getOptionsDto: GetOptionsDto,
    ): Promise<UserDto> {
        return this.userService.getUser(userId, getOptionsDto);
    }

    @Put('me')
    @Auth(RoleType.BUYER, RoleType.SELLER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    updateCurrentUser(
        @AuthUser() currentUser: UserEntity,
        @Body() user: UpdateUserDto,
    ) {
        return this.userService.updateUser(currentUser.id, user);
    }

    @Put('activate')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User activated',
        type: ActivateUserRO,
    })
    activateUser(@Body() activateDto: ActivateUserDto) {
        return this.userService.activateUser(activateDto);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    updateUser(@Body() user: UpdateUserDto, @UUIDParam('id') userId: string) {
        return this.userService.updateUser(userId, user);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted country',
        type: UserDto,
    })
    deleteCountry(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<UserDto> {
        this.logger.debug(`Delete user, current user: ${user.id}, user: ${id}`);
        return this.userService.deleteUser(id);
    }
}
