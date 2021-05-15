import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageModule } from '../image/image.module';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryRepository]), ImageModule],
    controllers: [CategoryController],
    exports: [CategoryService],
    providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}
