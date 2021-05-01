import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module';
import { ImageModule } from '../image/image.module';
import { LocationModule } from '../location/location.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { RequestController } from './request.controller';
import { RequestRepository } from './request.repository';
import { RequestResolver } from './request.resolver';
import { RequestService } from './request.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RequestRepository]),
        CategoryModule,
        LocationModule,
        SubCategoryModule,
        ImageModule,
    ],
    controllers: [RequestController],
    exports: [RequestService],
    providers: [RequestService, RequestResolver],
})
export class RequestModule {}
