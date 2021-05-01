import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryRepository } from './sub-category.repository';
import { SubCategoryResolver } from './sub-category.resolver';
import { SubCategoryService } from './sub-category.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SubCategoryRepository]),
        CategoryModule,
    ],
    controllers: [SubCategoryController],
    exports: [SubCategoryService],
    providers: [SubCategoryService, SubCategoryResolver],
})
export class SubCategoryModule {}
