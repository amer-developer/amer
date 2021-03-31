import { Args, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { Auth } from '../../decorators/http.decorators';
import { CountryService } from './country.service';
import { CountriesPageOptionsDto } from './dto/countries-page-options.dto';
import { CountriesPageDto } from './dto/countries-page.dto';
import { CountryDto } from './dto/country.dto';

@Resolver(() => CountryDto)
export class CountryResolver {
    constructor(private countryService: CountryService) {}

    @Query(() => CountriesPageDto, { name: 'countries' })
    getCountries(
        @Args()
        pageOptionsDto: CountriesPageOptionsDto,
    ): Promise<CountriesPageDto> {
        return this.countryService.getCountries(pageOptionsDto);
    }

    @Query(() => CountryDto, { name: 'country' })
    @Auth(RoleType.USER)
    getCountry(@Args('id') id: string): Promise<CountryDto> {
        return this.countryService.getCountry(id);
    }
}
