import { Args, Query, Resolver } from '@nestjs/graphql';

// import { UsersPageOptionsDto } from './dto/UsersPageOptionsDto';
import { RoleType } from '../../common/constants/role-type';
import { Auth } from '../../decorators/http.decorators';
// import { PageDto } from '../../common/dto/PageDto';
import { UserDto } from './dto/UserDto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private userService: UserService) {}

    // @Query(() => [UserDto])
    // users(
    //     @Args('options')
    //     pageOptionsDto: UsersPageOptionsDto,
    // ): Promise<PageDto<UserDto>> {
    //     return this.userService.getUsers(pageOptionsDto);
    // }

    @Query(() => UserDto)
    @Auth(RoleType.USER)
    user(@Args('id') id: string): Promise<UserDto> {
        return this.userService.getUser(id);
    }
}
