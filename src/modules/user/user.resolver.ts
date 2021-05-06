import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ActivateUserRO } from './dto/activate-user.ro';
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
    @Auth(RoleType.ADMIN)
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
    getUser(
        @Args('id') id: string,
        @Args({ nullable: true }) getOptionsDto: GetOptionsDto,
    ): Promise<UserDto> {
        return this.userService.getUser(id, getOptionsDto);
    }

    @Mutation(() => UserDto, { name: 'me' })
    @Auth(RoleType.BUYER, RoleType.SELLER, RoleType.ADMIN)
    updateCurrentUser(
        @AuthUser() currentUser: UserEntity,
        @Args() user: UpdateUserInput,
    ) {
        return this.userService.updateUser(currentUser.id, user);
    }

    @Mutation(() => ActivateUserRO, { name: 'activate' })
    activateUser(@Args() activateDto: ActivateUserDto) {
        return this.userService.activateUser(activateDto);
    }

    @Mutation(() => UserDto, { name: 'updateUser' })
    @Auth(RoleType.ADMIN)
    updateUser(@Args() user: UpdateUserInput, @Args('id') userId: string) {
        return this.userService.updateUser(userId, user);
    }
}
