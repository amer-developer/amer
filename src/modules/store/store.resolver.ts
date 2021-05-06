import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreDto } from './dto/store.dto';
import { StoresPageOptionsDto } from './dto/stores-page-options.dto';
import { StoresPageDto } from './dto/stores-page.dto';
import { UpdateStoreInput } from './dto/update-store.dto';
import { StoreService } from './store.service';

@Resolver(() => StoreDto)
export class StoreResolver {
    private logger = new Logger(StoreResolver.name);

    constructor(private storeService: StoreService) {}

    @Mutation(() => StoreDto, { name: 'createStore' })
    @Auth(RoleType.ADMIN)
    createStore(
        @Args()
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
    @Query(() => StoresPageDto, { name: 'stores' })
    getStores(
        @Args()
        pageOptionsDto: StoresPageOptionsDto,
    ): Promise<StoresPageDto> {
        return this.storeService.getStores(pageOptionsDto);
    }

    @Query(() => StoreDto, { name: 'store' })
    getStore(@Args('id', new ParseUUIDPipe()) id: string): Promise<StoreDto> {
        return this.storeService.getStore(id);
    }

    @Mutation(() => StoreDto, { name: 'updateStore' })
    @Auth(RoleType.ADMIN)
    updateStore(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() store: UpdateStoreInput,
        @AuthUser() user: UserEntity,
    ): Promise<StoreDto> {
        this.logger.debug(
            `Update store, user: ${user.id}, store ${JSON.stringify(store)}`,
        );

        return this.storeService.updateStore(id, store);
    }

    @Mutation(() => StoreDto, { name: 'deleteStore' })
    @Auth(RoleType.ADMIN)
    deleteStore(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<StoreDto> {
        this.logger.debug(`Delete store, user: ${user.id}, store: ${id}`);

        return this.storeService.deleteStore(id);
    }
}
