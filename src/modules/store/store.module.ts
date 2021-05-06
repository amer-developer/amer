import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module';
import { LocationModule } from '../location/location.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { UserModule } from '../user/user.module';
import { StoreController } from './store.controller';
import { StoreRepository } from './store.repository';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StoreRepository]),
        CategoryModule,
        SubCategoryModule,
        LocationModule,
        UserModule,
    ],
    controllers: [StoreController],
    exports: [StoreService],
    providers: [StoreService, StoreResolver],
})
export class StoreModule {}
