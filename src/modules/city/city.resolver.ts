import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CityService } from './city.service';
import { CitiesPageOptionsDto } from './dto/cities-page-options.dto';
import { CitiesPageDto } from './dto/cities-page.dto';
import { CityDto } from './dto/city.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityInput } from './dto/update-city.dto';

@Resolver(() => CityDto)
export class CityResolver {
    private logger = new Logger(CityResolver.name);

    constructor(private cityService: CityService) {}

    @Mutation(() => CityDto, { name: 'createCity' })
    @Auth(RoleType.ADMIN)
    createCity(
        @Args()
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
    @Query(() => CitiesPageDto, { name: 'cities' })
    getCities(
        @Args()
        pageOptionsDto: CitiesPageOptionsDto,
    ): Promise<CitiesPageDto> {
        return this.cityService.getCities(pageOptionsDto);
    }

    @Query(() => CityDto, { name: 'city' })
    getCity(@Args('id', new ParseUUIDPipe()) id: string): Promise<CityDto> {
        return this.cityService.getCity(id);
    }

    @Mutation(() => CityDto, { name: 'updateCity' })
    @Auth(RoleType.ADMIN)
    updateCity(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() city: UpdateCityInput,
        @AuthUser() user: UserEntity,
    ): Promise<CityDto> {
        this.logger.debug(
            `Update city, user: ${user.id}, city ${JSON.stringify(city)}`,
        );

        return this.cityService.updateCity(id, city);
    }

    @Mutation(() => CityDto, { name: 'deleteCity' })
    @Auth(RoleType.ADMIN)
    deleteCity(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<CityDto> {
        this.logger.debug(`Delete city, user: ${user.id}, city: ${id}`);

        return this.cityService.deleteCity(id);
    }
}
