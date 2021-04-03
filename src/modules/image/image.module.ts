import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { ImageController } from './image.controller';
import { ImageRepository } from './image.repository';
import { ImageResolver } from './image.resolver';
import { ImageService } from './image.service';

@Module({
    imports: [TypeOrmModule.forFeature([ImageRepository]), SharedModule],
    controllers: [ImageController],
    exports: [ImageService],
    providers: [ImageService, ImageResolver],
})
export class ImageModule {}
