import { Args, Query, Resolver } from '@nestjs/graphql';

// import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { RoleType } from '../../common/constants/role-type';
import { Auth } from '../../decorators/http.decorators';
// import { PageDto } from '../../common/dto/PageDto';
import { UserDto } from './dto/UserDto';
import { UsersPageDto } from './dto/UsersPageDto';
import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { UserService } from './user.service';

@Resolver(() => UserDto)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query(() => UsersPageDto, { name: 'users' })
    getUsers(
        @Args()
        pageOptionsDto: UsersPageOptionsDto,
    ): Promise<UsersPageDto> {
        return this.userService.getUsers(pageOptionsDto);
    }

    @Query(() => UserDto, { name: 'user' })
    @Auth(RoleType.USER)
    getUser(@Args('id') id: string): Promise<UserDto> {
        return this.userService.getUser(id);
    }
}
