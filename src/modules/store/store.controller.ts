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
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreDto } from './dto/store.dto';
import { StoresPageOptionsDto } from './dto/stores-page-options.dto';
import { StoresPageDto } from './dto/stores-page.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './store.service';

@Controller('stores')
@ApiTags('stores')
export class StoreController {
    private logger = new Logger(StoreController.name);
    constructor(private storeService: StoreService) {}

    @Post()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New store',
        type: StoreDto,
    })
    createStore(
        @Body()
        store: CreateStoreDto,
        @AuthUser() user: UserEntity,
    ): Promise<StoreDto> {
        this.logger.debug(
            `Creating a new store, user: ${user.id}, store ${JSON.stringify(
                store,
            )}`,
        );
        return this.storeService.createStore(store);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get stores list',
        type: StoresPageDto,
    })
    getStores(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: StoresPageOptionsDto,
    ): Promise<StoresPageDto> {
        return this.storeService.getStores(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a store',
        type: StoreDto,
    })
    getStore(@UUIDParam('id') storeId: string): Promise<StoreDto> {
        return this.storeService.getStore(storeId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated store',
        type: StoreDto,
    })
    updateStore(
        @UUIDParam('id') storeId: string,
        @Body() store: UpdateStoreDto,
        @AuthUser() user: UserEntity,
    ): Promise<StoreDto> {
        this.logger.debug(
            `Update store, user: ${user.id}, store ${JSON.stringify(store)}`,
        );

        return this.storeService.updateStore(storeId, store);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted store',
        type: StoreDto,
    })
    deleteStore(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<StoreDto> {
        this.logger.debug(`Delete store, user: ${user.id}, store: ${id}`);

        return this.storeService.deleteStore(id);
    }
}
