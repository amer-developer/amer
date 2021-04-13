import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { DistrictDto } from './dto/district.dto';
import { DistrictsPageOptionsDto } from './dto/districts-page-options.dto';
import { DistrictsPageDto } from './dto/districts-page.dto';
import { UpdateDistrictInput } from './dto/update-district.dto';

@Resolver(() => DistrictDto)
export class DistrictResolver {
    private logger = new Logger(DistrictResolver.name);

    constructor(private districtService: DistrictService) {}

    @Mutation(() => DistrictDto, { name: 'createDistrict' })
    @Auth(RoleType.ADMIN)
    createDistrict(
        @Args()
        district: CreateDistrictDto,
        @AuthUser() user: UserEntity,
    ): Promise<DistrictDto> {
        this.logger.debug(
            `Creating a new district, user: ${
                user.id
            }, district ${JSON.stringify(district)}`,
        );
        return this.districtService.createDistrict(district);
    }
    @Query(() => DistrictsPageDto, { name: 'districts' })
    getDistricts(
        @Args()
        pageOptionsDto: DistrictsPageOptionsDto,
    ): Promise<DistrictsPageDto> {
        return this.districtService.getDistricts(pageOptionsDto);
    }

    @Query(() => DistrictDto, { name: 'district' })
    getDistrict(
        @Args('id', new ParseUUIDPipe()) id: string,
    ): Promise<DistrictDto> {
        return this.districtService.getDistrict(id);
    }

    @Mutation(() => DistrictDto, { name: 'updateDistrict' })
    @Auth(RoleType.ADMIN)
    updateDistrict(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() district: UpdateDistrictInput,
        @AuthUser() user: UserEntity,
    ): Promise<DistrictDto> {
        this.logger.debug(
            `Update district, user: ${user.id}, district ${JSON.stringify(
                district,
            )}`,
        );

        return this.districtService.updateDistrict(id, district);
    }

    @Mutation(() => DistrictDto, { name: 'deleteDistrict' })
    @Auth(RoleType.ADMIN)
    deleteDistrict(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<DistrictDto> {
        this.logger.debug(`Delete district, user: ${user.id}, district: ${id}`);

        return this.districtService.deleteDistrict(id);
    }
}
