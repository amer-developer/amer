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
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CountryService } from './country.service';
import { CountriesPageOptionsDto } from './dto/countries-page-options.dto';
import { CountriesPageDto } from './dto/countries-page.dto';
import { CountryDto } from './dto/country.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Controller('countries')
@ApiTags('countries')
export class CountryController {
    private logger = new Logger(CountryController.name);
    constructor(private countryService: CountryService) {}

    @Post()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New country',
        type: CountriesPageDto,
    })
    createCountry(
        @Body()
        country: CreateCountryDto,
        @AuthUser() user: UserEntity,
    ): Promise<CountryDto> {
        this.logger.debug(
            `Creating a new country, user: ${user.id}, country ${JSON.stringify(
                country,
            )}`,
        );
        return this.countryService.createCountry(country);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get countries list',
        type: CountriesPageDto,
    })
    getCountries(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: CountriesPageOptionsDto,
    ): Promise<CountriesPageDto> {
        return this.countryService.getCountries(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a country',
        type: CountryDto,
    })
    getCountry(
        @UUIDParam('id') countryId: string,
        @Query(new ValidationPipe({ transform: true }))
        getOptionsDto: GetOptionsDto,
    ): Promise<CountryDto> {
        return this.countryService.getCountry(countryId, getOptionsDto);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated country',
        type: CountryDto,
    })
    updateCountry(
        @UUIDParam('id') countryId: string,
        @Body() country: UpdateCountryDto,
        @AuthUser() user: UserEntity,
    ): Promise<CountryDto> {
        this.logger.debug(
            `Update country, user: ${user.id}, country ${JSON.stringify(
                country,
            )}`,
        );

        return this.countryService.updateCountry(countryId, country);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted country',
        type: CountryDto,
    })
    deleteCountry(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<CountryDto> {
        this.logger.debug(`Delete country, user: ${user.id}, country: ${id}`);

        return this.countryService.deleteCountry(id);
    }
}
