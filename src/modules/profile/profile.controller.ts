import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { ProfileDto } from './dto/profile.dto';
import { ProfilesPageDto } from './dto/profiles-page.dto';
import { ProfilesPageOptionsDto } from './dto/profiles-page.options.dto';
import { ProfileService } from './profile.service';

@Controller('profiles')
@ApiTags('profiles')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @Get()
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get profiles list',
        type: ProfilesPageDto,
    })
    getProfiles(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: ProfilesPageOptionsDto,
    ): Promise<ProfilesPageDto> {
        return this.profileService.getProfiles(pageOptionsDto);
    }

    @Get(':id')
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a profile',
        type: ProfileDto,
    })
    getProfile(@UUIDParam('id') profileId: string): Promise<ProfileDto> {
        return this.profileService.getProfile(profileId);
    }
}
