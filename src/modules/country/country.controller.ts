import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { Query as GLQuery } from '@nestjs/graphql';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { CountryService } from './country.service';
import { CountriesPageOptionsDto } from './dto/countries-page-options.dto';
import { CountriesPageDto } from './dto/countries-page.dto';
import { CountryDto } from './dto/country.dto';

@Controller('countries')
@ApiTags('countries')
export class CountryController {
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
        country: CountryDto,
    ): Promise<CountryDto> {
        return this.countryService.createCountry(country);
    }

    @Get()
    @Auth(RoleType.USER)
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
    @GLQuery(() => CountryDto)
    @Auth(RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a country',
        type: CountryDto,
    })
    getCountry(@UUIDParam('id') countryId: string): Promise<CountryDto> {
        return this.countryService.getCountry(countryId);
    }
}
