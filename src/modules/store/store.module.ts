import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StoreController } from './store.controller';
import { StoreRepository } from './store.repository';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';

@Module({
    imports: [TypeOrmModule.forFeature([StoreRepository])],
    controllers: [StoreController],
    exports: [StoreService],
    providers: [StoreService, StoreResolver],
})
export class StoreModule {}
