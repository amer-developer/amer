import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
    Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CityService } from './city.service';
import { CitiesPageOptionsDto } from './dto/cities-page-options.dto';
import { CitiesPageDto } from './dto/cities-page.dto';
import { CityDto } from './dto/city.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
@ApiTags('cities')
export class CityController {
    private logger = new Logger(CityController.name);
    constructor(private cityService: CityService) {}

    @Post()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New city',
        type: CitiesPageDto,
    })
    createCity(
        @Body()
        city: CreateCityDto,
        @AuthUser() user: UserEntity,
    ): Promise<CityDto> {
        this.logger.debug(
            `Creating a new city, user: ${user.id}, city ${JSON.stringify(
                city,
            )}`,
        );
        return this.cityService.createCity(city);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get cities list',
        type: CitiesPageDto,
    })
    getCities(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: CitiesPageOptionsDto,
    ): Promise<CitiesPageDto> {
        return this.cityService.getCities(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a city',
        type: CityDto,
    })
    getCity(@UUIDParam('id') cityId: string): Promise<CityDto> {
        return this.cityService.getCity(cityId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated city',
        type: CityDto,
    })
    updateCity(
        @UUIDParam('id') cityId: string,
        @Body() city: UpdateCityDto,
        @AuthUser() user: UserEntity,
    ): Promise<CityDto> {
        this.logger.debug(
            `Update city, user: ${user.id}, city ${JSON.stringify(city)}`,
        );

        return this.cityService.updateCity(cityId, city);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted city',
        type: CityDto,
    })
    deleteCity(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<CityDto> {
        this.logger.debug(`Delete city, user: ${user.id}, city: ${id}`);

        return this.cityService.deleteCity(id);
    }
}
