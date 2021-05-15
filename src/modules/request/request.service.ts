import { Injectable, Logger } from '@nestjs/common';
import {
    DeepPartial,
    FindConditions,
    FindOneOptions,
    SaveOptions,
} from 'typeorm';

import { ImageFolder } from '../../common/constants/image-folder';
import { RequestStatus } from '../../common/constants/request-status';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { RequestNotFoundException } from '../../exceptions/request-not-found.exception';
import { CategoryService } from '../category/category.service';
import { CategoryDto } from '../category/dto/category.dto';
import { CreateImageDto } from '../image/dto/create-image.dto';
import { ImageService } from '../image/image.service';
import { LocationDto } from '../location/dto/location.dto';
import { LocationService } from '../location/location.service';
import { SubCategoryDto } from '../sub-category/dto/sub-category.dto';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
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
        public readonly locationService: LocationService,
        public readonly categoryService: CategoryService,
        public readonly subCategoryService: SubCategoryService,
        public readonly imageService: ImageService,
        public readonly userService: UserService,
    ) {}

    /**
     * Find single request
     */
    findOne(
        findData: FindConditions<RequestEntity>,
        findOneOptions?: FindOneOptions<RequestEntity>,
    ): Promise<RequestEntity> {
        return this.requestRepository.findOne(findData, findOneOptions);
    }

    save(
        entities: DeepPartial<RequestEntity>,
        opts?: SaveOptions,
    ): Promise<RequestEntity> {
        return this.requestRepository.save(entities, opts);
    }

    async createRequest(requestDto: CreateRequestDto): Promise<RequestDto> {
        const {
            category,
            subCategory,
            location,
            images,
            owner,
        } = await this.validateRequestInputs(requestDto);

        const request = this.requestRepository.create({
            ...requestDto,
            location,
            category,
            subCategory,
            images,
            owner,
        });

        const savedEntity = await this.requestRepository.save(request);

        this.logger.log(`Created request ${JSON.stringify(savedEntity)}`);

        return this.getRequest(savedEntity.id, {
            includes: [
                'location',
                'category',
                'subCategory',
                'images',
                'owner',
            ],
        });
    }

    async getRequests(
        pageOptionsDto: RequestsPageOptionsDto,
    ): Promise<RequestsPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.requestRepository
            .createQueryBuilder('request')
            .leftJoinAndSelect('request.images', 'images')
            .leftJoinAndSelect('request.category', 'category')
            .leftJoinAndSelect('request.subCategory', 'subCategory')
            .leftJoinAndSelect('request.location', 'location')
            .leftJoinAndSelect('location.country', 'country')
            .leftJoinAndSelect('location.city', 'city')
            .leftJoinAndSelect('location.district', 'district')
            .leftJoinAndSelect('request.owner', 'owner')
            .leftJoinAndSelect('owner.profile', 'profile');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(
                pageOptionsDto.q,
                ['title', 'description', 'reference'],
                true,
            );
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getRequest(id: string, options?: GetOptionsDto) {
        const requestEntity = await this.findOne(
            { id },
            { relations: options?.includes },
        );

        if (!requestEntity) {
            throw new RequestNotFoundException();
        }

        return requestEntity.toDto();
    }

    async updateRequest(id: string, requestDto: UpdateRequestDto) {
        const requestEntity = await this.findOne(
            { id },
            { relations: ['location'] },
        );
        if (!requestEntity) {
            throw new RequestNotFoundException();
        }

        const {
            category,
            subCategory,
            location,
            images,
            owner,
        } = await this.validateRequestInputs(
            requestDto,
            requestEntity.location.id,
        );

        const request = await this.requestRepository.save({
            id: requestEntity.id,
            ...requestDto,
            location,
            category,
            subCategory,
            images,
            owner,
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
        await this.requestRepository.save({
            id: requestEntity.id,
            status: RequestStatus.DELETED,
        });
        requestEntity.status = RequestStatus.DELETED;
        return requestEntity.toDto();
    }

    private async validateRequestInputs(
        requestDto: Partial<CreateRequestDto>,
        locationID?: string,
    ) {
        let locationDto: LocationDto;
        let category: CategoryDto;
        let subCategory: SubCategoryDto;
        let imagesDto: CreateImageDto[];
        let owner: UserDto;
        const {
            categoryID,
            subCategoryID,
            images,
            ownerID,
            location,
        } = requestDto;
        if (categoryID) {
            category = await this.categoryService.getCategory(categoryID);
        }
        if (subCategoryID) {
            subCategory = await this.subCategoryService.getSubCategory(
                subCategoryID,
                categoryID,
            );
        }
        if (ownerID) {
            owner = await this.userService.getUser(ownerID);
        }
        if (images) {
            imagesDto = images.map((item) => ({
                ...item,
                folder: ImageFolder.REQUEST,
            }));
        }
        if (location) {
            locationDto = await this.locationService.createLocation(
                location,
                locationID,
            );
        }

        return {
            category,
            subCategory,
            owner,
            images: imagesDto,
            location: locationDto,
        };
    }
}
