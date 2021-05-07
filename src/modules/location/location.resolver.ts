import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
// import { CreateLocationDto } from './dto/create-location.dto';
import { LocationDto } from './dto/location.dto';
import { LocationsPageOptionsDto } from './dto/locations-page-options.dto';
import { LocationsPageDto } from './dto/locations-page.dto';
import { UpdateLocationInput } from './dto/update-location.dto';
import { LocationService } from './location.service';

@Resolver(() => LocationDto)
export class LocationResolver {
    private logger = new Logger(LocationResolver.name);

    constructor(private locationService: LocationService) {}

    @Query(() => LocationsPageDto, { name: 'locations' })
    getLocations(
        @Args()
        pageOptionsDto: LocationsPageOptionsDto,
    ): Promise<LocationsPageDto> {
        return this.locationService.getLocations(pageOptionsDto);
    }

    @Query(() => LocationDto, { name: 'location' })
    getLocation(
        @Args('id', new ParseUUIDPipe()) id: string,
    ): Promise<LocationDto> {
        return this.locationService.getLocation(id);
    }

    @Mutation(() => LocationDto, { name: 'updateLocation' })
    @Auth(RoleType.ADMIN)
    updateLocation(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() location: UpdateLocationInput,
        @AuthUser() user: UserEntity,
    ): Promise<LocationDto> {
        this.logger.debug(
            `Update location, user: ${user.id}, location ${JSON.stringify(
                location,
            )}`,
        );

        return this.locationService.updateLocation(id, location);
    }

    @Mutation(() => LocationDto, { name: 'deleteLocation' })
    @Auth(RoleType.ADMIN)
    deleteLocation(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<LocationDto> {
        this.logger.debug(`Delete location, user: ${user.id}, location: ${id}`);

        return this.locationService.deleteLocation(id);
    }
}
