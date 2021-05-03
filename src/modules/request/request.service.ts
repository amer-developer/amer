import { Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindOneOptions } from 'typeorm';

import { RequestStatus } from '../../common/constants/request-status';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { RequestNotFoundException } from '../../exceptions/request-not-found.exception';
import { CategoryService } from '../category/category.service';
import { CategoryDto } from '../category/dto/category.dto';
import { ImageDto } from '../image/dto/image.dto';
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

    async createRequest(
        requestDto: CreateRequestDto,
        user: UserDto,
    ): Promise<RequestDto> {
        const {
            category,
            subCategory,
            location,
            images,
            owner,
        } = await this.validateRequestInputs(requestDto, user);

        const request = this.requestRepository.create({
            ...requestDto,
            location,
            category,
            subCategory,
            images,
            owner,
        });

        const savedEntity = await this.requestRepository.save(request);
        return savedEntity.toDto();
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
            .leftJoinAndSelect('request.owner', 'owner')
            .leftJoinAndSelect('owner.profile', 'profile');

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

    async updateRequest(
        id: string,
        requestDto: UpdateRequestDto,
        user: UserDto,
    ) {
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
            user,
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
        user: UserDto,
        locationID?: string,
    ) {
        let locationDto: LocationDto;
        const imagesDtos: ImageDto[] = [];
        let category: CategoryDto;
        let subCategory: SubCategoryDto;
        let owner = user;
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
        if (images) {
            this.logger.log(requestDto.imagesItems);
            this.logger.log(images);
            for (const item of requestDto.imagesItems) {
                this.logger.log(item);
                const image = await this.imageService.findImage({
                    url: item.item,
                });
                imagesDtos.push(image);
            }
        }
        if (ownerID) {
            owner = await this.userService.getUser(ownerID);
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
            images: imagesDtos,
            location: locationDto,
        };
    }
}
