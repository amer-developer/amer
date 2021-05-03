import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { FindConditions, FindOneOptions } from 'typeorm';

import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import { IFile } from '../../interfaces/IFile';
import { CloudinaryService } from '../../shared/modules/cloudinary/cloudinary.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageDto } from './dto/image.dto';
import { ImagesPageOptionsDto } from './dto/images-page-options.dto';
import { ImagesPageDto } from './dto/images-page.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImageEntity } from './image.entity';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
    private logger = new Logger(ImageService.name);
    constructor(
        public readonly imageRepository: ImageRepository,
        public readonly validatorService: ValidatorService,
        public readonly cloudinary: CloudinaryService,
    ) {}

    /**
     * Find single image
     */
    findOne(
        findData: FindConditions<ImageEntity>,
        findOneOptions?: FindOneOptions<ImageEntity>,
    ): Promise<ImageEntity> {
        return this.imageRepository.findOne(findData, findOneOptions);
    }

    async createImage(
        imageDto: CreateImageDto,
        file: IFile,
    ): Promise<ImageDto> {
        const uploadedFile = await this.uploadImage(
            [file],
            imageDto.name,
            imageDto.folder,
        );
        const image = this.imageRepository.create({
            ...imageDto,
            url: uploadedFile[0].secure_url,
        });

        const savedEntity = await this.imageRepository.save(image);
        return savedEntity.toDto();
    }

    async createImages(
        imageDto: CreateImageDto,
        files: IFile[],
    ): Promise<ImageDto[]> {
        const images: ImageEntity[] = [];
        for (const file of files) {
            const uploadedFile = await this.uploadImage(
                [file],
                imageDto.name,
                imageDto.folder,
            );
            const image = this.imageRepository.create({
                ...imageDto,
                url: uploadedFile[0].secure_url,
            });

            const savedEntity = await this.imageRepository.save(image);
            images.push(savedEntity);
        }
        return images.toDtos();
    }

    async getImages(
        pageOptionsDto: ImagesPageOptionsDto,
    ): Promise<ImagesPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.imageRepository.createQueryBuilder('image');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'nameAR',
                'nameEN',
                'code',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getImage(id: string) {
        const imageEntity = await this.findOne({ id });

        return imageEntity.toDto();
    }

    async updateImage(id: string, image: UpdateImageDto) {
        const imageEntity = await this.findOne({ id });
        if (!imageEntity) {
            throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
        }

        await this.imageRepository.save({
            id: imageEntity.id,
            ...image,
        });

        let updatedImage = imageEntity.toDto();
        updatedImage = { ...updatedImage, ...image };

        return updatedImage;
    }

    async deleteImage(id: string) {
        const imageEntity = await this.findOne({ id });
        if (!imageEntity) {
            throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
        }
        await this.imageRepository.delete({
            id: imageEntity.id,
        });
        return imageEntity.toDto();
    }

    public async uploadImage(files: IFile[], name?: string, type?: string) {
        this.logger.debug(files);
        const data = new Array<UploadApiErrorResponse | UploadApiResponse>();
        for (const file of files) {
            if (file && !this.validatorService.isImage(file.mimetype)) {
                throw new FileNotImageException();
            }
        }
        for (const file of files) {
            const fileData = await this.cloudinary
                .uploadImage(file, name, type)
                .catch((err) => {
                    this.logger.error(err);
                    throw new BadRequestException('Invalid file type.');
                });
            data.push(fileData);
        }
        return data;
    }
}
