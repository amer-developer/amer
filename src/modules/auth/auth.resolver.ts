import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-tools';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { IFile } from '../../interfaces/IFile';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginRo } from './dto/login.ro';
import { RegisterDto } from './dto/register.dto';

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

    @Mutation(() => UserDto, { name: 'register' })
    async userRegister(
        @Args() userRegisterDto: RegisterDto,
        @Args('file', { type: () => GraphQLUpload, nullable: true })
        file: IFile,
    ): Promise<UserDto> {
        const createdUser = await this.userService.createUser(
            userRegisterDto,
            file,
        );

        return createdUser.toDto();
    }

    @Query(() => UserDto, { name: 'me' })
    @Auth(RoleType.USER)
    getCurrentUser(@AuthUser() user: UserEntity) {
        return user.toDto();
    }
}
