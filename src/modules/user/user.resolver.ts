import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { ActivateUserDto } from './dto/activate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UsersPageDto } from './dto/users-page.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => UserDto)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(() => UserDto, { name: 'createUser' })
    async userRegister(@Args() createUserDto: CreateUserDto): Promise<UserDto> {
        const createdUser = await this.userService.createUser(createUserDto);
        return createdUser.toDto();
    }

    @Query(() => UsersPageDto, { name: 'users' })
    getUsers(
        @Args()
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<UsersPageDto> {
        return this.userService.getUsers(pageOptionsDto);
    }

    @Query(() => UserDto, { name: 'user' })
    @Auth(RoleType.ADMIN, RoleType.BUYER)
    getUser(@Args('id') id: string): Promise<UserDto> {
        return this.userService.getUser(id);
    }

    @Mutation(() => UserDto, { name: 'me' })
    @Auth(RoleType.BUYER, RoleType.SELLER, RoleType.ADMIN)
    updateCurrentUser(
        @AuthUser() currentUser: UserEntity,
        @Args() user: UpdateUserInput,
    ) {
        return this.userService.updateUser(currentUser.id, user);
    }

    @Mutation(() => UserDto, { name: 'activate' })
    activateUser(@Args() activateDto: ActivateUserDto) {
        return this.userService.activateUser(activateDto);
    }

    @Mutation(() => UserDto, { name: 'updateUser' })
    @Auth(RoleType.ADMIN)
    updateUser(@Args() user: UpdateUserInput, @Args('id') userId: string) {
        return this.userService.updateUser(userId, user);
    }
}
