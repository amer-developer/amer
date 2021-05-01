import { Injectable, Logger } from '@nestjs/common';
import { FindConditions } from 'typeorm';

import { RequestNotFoundException } from '../../exceptions/request-not-found.exception';
import { ValidatorService } from '../../shared/services/validator.service';
import { CategoryService } from '../category/category.service';
import { ImageDto } from '../image/dto/image.dto';
import { ImageService } from '../image/image.service';
import { LocationDto } from '../location/dto/location.dto';
import { LocationService } from '../location/location.service';
import { SubCategoryDto } from '../sub-category/dto/sub-category.dto';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { UserEntity } from '../user/user.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestDto } from './dto/request.dto';
import { RequestsPageOptionsDto } from './dto/requests-page-options.dto';
import { RequestsPageDto } from './dto/requests-page.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestEntity } from './request.entity';
import { RequestRepository } from './request.repository';

@Injectable()
export class RequestService {
    private logger = new Logger(RequestService.name);
    constructor(
        public readonly requestRepository: RequestRepository,
        public readonly validatorService: ValidatorService,
        public readonly locationService: LocationService,
        public readonly categoryService: CategoryService,
        public readonly subCategoryService: SubCategoryService,
        public readonly imageService: ImageService,
    ) {}

    /**
     * Find single request
     */
    findOne(findData: FindConditions<RequestEntity>): Promise<RequestEntity> {
        return this.requestRepository.findOne(findData);
    }

    async createRequest(
        requestDto: CreateRequestDto,
        user: UserEntity,
    ): Promise<RequestDto> {
        let location: LocationDto;
        let images: ImageDto[];
        let subCategory: SubCategoryDto;
        const category = await this.categoryService.getCategory(
            requestDto.categoryID,
        );
        if (requestDto.subCategoryID) {
            subCategory = await this.subCategoryService.getSubCategory(
                requestDto.subCategoryID,
            );
        }
        if (requestDto.images) {
            for (const imageID of requestDto.images) {
                const image = await this.imageService.getImage(imageID);
                images.push(image);
            }
        }
        if (requestDto.location) {
            location = await this.locationService.createLocation(
                requestDto.location,
            );
            delete requestDto.location;
        }

        const request = this.requestRepository.create({
            ...requestDto,
            location,
            category,
            subCategory,
            images,
            owner: user.toDto(),
        });

        const savedEntity = await this.requestRepository.save(request);
        return savedEntity.toDto();
    }

    async getRequests(
        pageOptionsDto: RequestsPageOptionsDto,
    ): Promise<RequestsPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.requestRepository.createQueryBuilder('request');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'title',
                'description',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getRequest(id: string) {
        const requestEntity = await this.findOne({ id });

        if (!requestEntity) {
            throw new RequestNotFoundException();
        }

        return requestEntity.toDto();
    }

    async updateRequest(id: string, requestDto: UpdateRequestDto) {
        const requestEntity = await this.findOne({ id });
        if (!requestEntity) {
            throw new RequestNotFoundException();
        }

        let location: LocationDto;
        let images: ImageDto[];
        let subCategory: SubCategoryDto;
        const category = await this.categoryService.getCategory(
            requestDto.categoryID,
        );
        if (requestDto.subCategoryID) {
            subCategory = await this.subCategoryService.getSubCategory(
                requestDto.subCategoryID,
            );
        }
        if (requestDto.images) {
            for (const imageID of requestDto.images) {
                const image = await this.imageService.getImage(imageID);
                images.push(image);
            }
        }
        if (requestDto.location) {
            location = await this.locationService.createLocation(
                requestDto.location,
                requestEntity.id,
            );
            delete requestDto.location;
        }

        const request = this.requestRepository.save({
            id: requestEntity.id,
            ...requestDto,
            location,
            category,
            subCategory,
            images,
        });

        let updatedRequest = requestEntity.toDto();
        updatedRequest = { ...updatedRequest, ...request };

        return updatedRequest;
    }

    async deleteRequest(id: string) {
        const requestEntity = await this.findOne({ id });
        if (!requestEntity) {
            throw new RequestNotFoundException();
        }
        await this.requestRepository.delete({
            id: requestEntity.id,
        });
        return requestEntity.toDto();
    }
}
