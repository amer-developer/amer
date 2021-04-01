import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CountryService } from './country.service';
import { CountriesPageOptionsDto } from './dto/countries-page-options.dto';
import { CountriesPageDto } from './dto/countries-page.dto';
import { CountryDto } from './dto/country.dto';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryInput } from './dto/update-country.dto';

@Resolver(() => CountryDto)
export class CountryResolver {
    private logger = new Logger(CountryResolver.name);

    constructor(private countryService: CountryService) {}

    @Mutation(() => CountryDto, { name: 'createCountry' })
    @Auth(RoleType.ADMIN)
    createCountry(
        @Args()
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
    @Query(() => CountriesPageDto, { name: 'countries' })
    getCountries(
        @Args()
        pageOptionsDto: CountriesPageOptionsDto,
    ): Promise<CountriesPageDto> {
        return this.countryService.getCountries(pageOptionsDto);
    }

    @Query(() => CountryDto, { name: 'country' })
    getCountry(
        @Args('id', new ParseUUIDPipe()) id: string,
    ): Promise<CountryDto> {
        return this.countryService.getCountry(id);
    }

    @Mutation(() => CountryDto, { name: 'updateCountry' })
    @Auth(RoleType.ADMIN)
    updateCountry(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() country: UpdateCountryInput,
        @AuthUser() user: UserEntity,
    ): Promise<CountryDto> {
        this.logger.debug(
            `Update country, user: ${user.id}, country ${JSON.stringify(
                country,
            )}`,
        );

        return this.countryService.updateCountry(id, country);
    }

    @Mutation(() => CountryDto, { name: 'deleteCountry' })
    @Auth(RoleType.ADMIN)
    deleteCountry(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<CountryDto> {
        this.logger.debug(`Delete country, user: ${user.id}, country: ${id}`);

        return this.countryService.deleteCountry(id);
    }
}
