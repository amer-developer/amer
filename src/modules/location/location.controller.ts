import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    // Post,
    Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
// import { CreateLocationDto } from './dto/create-location.dto';
import { LocationDto } from './dto/location.dto';
import { LocationsPageOptionsDto } from './dto/locations-page-options.dto';
import { LocationsPageDto } from './dto/locations-page.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';

@Controller('locations')
@ApiTags('locations')
export class LocationController {
    private logger = new Logger(LocationController.name);
    constructor(private locationService: LocationService) {}

    // @Post()
    // @Auth(RoleType.ADMIN)
    // @HttpCode(HttpStatus.OK)
    // @ApiResponse({
    //     status: HttpStatus.OK,
    //     description: 'New location',
    //     type: LocationsPageDto,
    // })
    // createLocation(
    //     @Body()
    //     location: CreateLocationDto,
    //     @AuthUser() user: UserEntity,
    // ): Promise<LocationDto> {
    //     this.logger.debug(
    //         `Creating a new location, user: ${
    //             user.id
    //         }, location ${JSON.stringify(location)}`,
    //     );
    //     return this.locationService.createLocation(location);
    // }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get locations list',
        type: LocationsPageDto,
    })
    getLocations(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: LocationsPageOptionsDto,
    ): Promise<LocationsPageDto> {
        return this.locationService.getLocations(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a location',
        type: LocationDto,
    })
    getLocation(@UUIDParam('id') locationId: string): Promise<LocationDto> {
        return this.locationService.getLocation(locationId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated location',
        type: LocationDto,
    })
    updateLocation(
        @UUIDParam('id') locationId: string,
        @Body() location: UpdateLocationDto,
        @AuthUser() user: UserEntity,
    ): Promise<LocationDto> {
        this.logger.debug(
            `Update location, user: ${user.id}, location ${JSON.stringify(
                location,
            )}`,
        );

        return this.locationService.updateLocation(locationId, location);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted location',
        type: LocationDto,
    })
    deleteLocation(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<LocationDto> {
        this.logger.debug(`Delete location, user: ${user.id}, location: ${id}`);

        return this.locationService.deleteLocation(id);
    }
}
