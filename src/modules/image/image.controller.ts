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
    UploadedFiles,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { ApiFile } from '../../decorators/swagger.schema';
import { IFile } from '../../interfaces/IFile';
import { UserEntity } from '../user/user.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageDto } from './dto/image.dto';
import { ImagesPageOptionsDto } from './dto/images-page-options.dto';
import { ImagesPageDto } from './dto/images-page.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImageService } from './image.service';

@Controller('images')
@ApiTags('images')
export class ImageController {
    private logger = new Logger(ImageController.name);
    constructor(private imageService: ImageService) {}

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiFile([{ name: 'files' }])
    @UseInterceptors(FilesInterceptor('files', 10))
    upload(@UploadedFiles() files: IFile[]) {
        return this.imageService.uploadImage(files);
    }

    @Post()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New image',
        type: ImagesPageDto,
    })
    createImage(
        @Body()
        image: CreateImageDto,
        @AuthUser() user: UserEntity,
    ): Promise<ImageDto> {
        this.logger.debug(
            `Creating a new image, user: ${user.id}, image ${JSON.stringify(
                image,
            )}`,
        );
        return this.imageService.createImage(image);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get images list',
        type: ImagesPageDto,
    })
    getImages(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: ImagesPageOptionsDto,
    ): Promise<ImagesPageDto> {
        return this.imageService.getImages(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a image',
        type: ImageDto,
    })
    getImage(@UUIDParam('id') imageId: string): Promise<ImageDto> {
        return this.imageService.getImage(imageId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated image',
        type: ImageDto,
    })
    updateImage(
        @UUIDParam('id') imageId: string,
        @Body() image: UpdateImageDto,
        @AuthUser() user: UserEntity,
    ): Promise<ImageDto> {
        this.logger.debug(
            `Update image, user: ${user.id}, image ${JSON.stringify(image)}`,
        );

        return this.imageService.updateImage(imageId, image);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted image',
        type: ImageDto,
    })
    deleteImage(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<ImageDto> {
        this.logger.debug(`Delete image, user: ${user.id}, image: ${id}`);

        return this.imageService.deleteImage(id);
    }
}
