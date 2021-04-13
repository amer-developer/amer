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
import { DistrictService } from './district.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { DistrictDto } from './dto/district.dto';
import { DistrictsPageOptionsDto } from './dto/districts-page-options.dto';
import { DistrictsPageDto } from './dto/districts-page.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Controller('districts')
@ApiTags('districts')
export class DistrictController {
    private logger = new Logger(DistrictController.name);
    constructor(private districtService: DistrictService) {}

    @Post()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New district',
        type: DistrictsPageDto,
    })
    createDistrict(
        @Body()
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

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get districts list',
        type: DistrictsPageDto,
    })
    getDistricts(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: DistrictsPageOptionsDto,
    ): Promise<DistrictsPageDto> {
        return this.districtService.getDistricts(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a district',
        type: DistrictDto,
    })
    getDistrict(@UUIDParam('id') districtId: string): Promise<DistrictDto> {
        return this.districtService.getDistrict(districtId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated district',
        type: DistrictDto,
    })
    updateDistrict(
        @UUIDParam('id') districtId: string,
        @Body() district: UpdateDistrictDto,
        @AuthUser() user: UserEntity,
    ): Promise<DistrictDto> {
        this.logger.debug(
            `Update district, user: ${user.id}, district ${JSON.stringify(
                district,
            )}`,
        );

        return this.districtService.updateDistrict(districtId, district);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted district',
        type: DistrictDto,
    })
    deleteDistrict(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<DistrictDto> {
        this.logger.debug(`Delete district, user: ${user.id}, district: ${id}`);

        return this.districtService.deleteDistrict(id);
    }
}
