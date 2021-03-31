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
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { ProfileDto } from './dto/ProfileDto';
import { ProfilesPageDto } from './dto/ProfilesPageDto';
import { ProfilesPageOptionsDto } from './dto/ProfilesPageOptionsDto';
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
    @GLQuery(() => ProfileDto)
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