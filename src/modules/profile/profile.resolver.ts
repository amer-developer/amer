import { Args, Query, Resolver } from '@nestjs/graphql';

// import { ProfilesPageOptionsDto } from './dto/ProfilesPageOptionsDto';
import { RoleType } from '../../common/constants/role-type';
import { Auth } from '../../decorators/http.decorators';
// import { PageDto } from '../../common/dto/PageDto';
import { ProfileDto } from './dto/ProfileDto';
import { ProfilesPageDto } from './dto/ProfilesPageDto';
import { ProfilesPageOptionsDto } from './dto/ProfilesPageOptionsDto';
import { ProfileService } from './profile.service';

@Resolver(() => ProfileDto)
export class ProfileResolver {
    constructor(private profileService: ProfileService) {}

    @Query(() => ProfilesPageDto, { name: 'profiles' })
    getProfiles(
        @Args()
        pageOptionsDto: ProfilesPageOptionsDto,
    ): Promise<ProfilesPageDto> {
        return this.profileService.getProfiles(pageOptionsDto);
    }

    @Query(() => ProfileDto, { name: 'profile' })
    @Auth(RoleType.USER)
    getProfile(@Args('id') id: string): Promise<ProfileDto> {
        return this.profileService.getProfile(id);
    }
}
