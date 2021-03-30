import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-tools';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { IFile } from '../../interfaces/IFile';
import { UserDto } from '../user/dto/UserDto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Resolver(() => UserDto)
export class AuthResolver {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
    ) {}

    @Mutation(() => LoginPayloadDto, { name: 'login' })
    async userLogin(
        @Args() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        const userEntity = await this.authService.validateUser(userLoginDto);

        const token = await this.authService.createToken(userEntity);
        return new LoginPayloadDto(userEntity.toDto(), token);
    }

    @Mutation(() => UserDto, { name: 'register' })
    async userRegister(
        @Args() userRegisterDto: UserRegisterDto,
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
