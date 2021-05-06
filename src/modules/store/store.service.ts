import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindOneOptions } from 'typeorm';

import { StoreNotFoundException } from '../../exceptions/store-not-found.exception';
import { ValidatorService } from '../../shared/services/validator.service';
import { CategoryService } from '../category/category.service';
import { CategoryDto } from '../category/dto/category.dto';
import { LocationDto } from '../location/dto/location.dto';
import { LocationService } from '../location/location.service';
import { SubCategoryDto } from '../sub-category/dto/sub-category.dto';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreDto } from './dto/store.dto';
import { StoresPageOptionsDto } from './dto/stores-page-options.dto';
import { StoresPageDto } from './dto/stores-page.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreEntity } from './store.entity';
import { StoreRepository } from './store.repository';

@Injectable()
export class StoreService {
    private logger = new Logger(StoreService.name);
    constructor(
        public readonly storeRepository: StoreRepository,
        public readonly validatorService: ValidatorService,
        public readonly locationService: LocationService,
        public readonly categoryService: CategoryService,
        public readonly subCategoryService: SubCategoryService,
        public readonly userService: UserService,
    ) {}

    /**
     * Find single store
     */
    findOne(
        findData: FindConditions<StoreEntity>,
        findOneOptions?: FindOneOptions<StoreEntity>,
    ): Promise<StoreEntity> {
        return this.storeRepository.findOne(findData, findOneOptions);
    }

    async createStore(storeDto: CreateStoreDto): Promise<StoreDto> {
        const {
            category,
            subCategory,
            location,
            users,
        } = await this.validateRequestInputs(storeDto);

        const store = this.storeRepository.create({
            ...storeDto,
            category,
            subCategory,
            location,
            users,
        });

        const savedEntity = await this.storeRepository.save(store);
        return savedEntity.toDto();
    }

    async getStores(
        pageOptionsDto: StoresPageOptionsDto,
    ): Promise<StoresPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.storeRepository.createQueryBuilder('store');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'storeNumber',
                'bio',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getStore(id: string) {
        const storeEntity = await this.findOne({ id });

        if (!storeEntity) {
            throw new StoreNotFoundException();
        }

        return storeEntity.toDto();
    }

    async updateStore(id: string, store: UpdateStoreDto) {
        const storeEntity = await this.findOne(
            { id },
            { relations: ['location'] },
        );
        if (!storeEntity) {
            throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
        }

        const {
            category,
            subCategory,
            location,
            users,
        } = await this.validateRequestInputs(store, storeEntity.location.id);

        await this.storeRepository.save({
            id: storeEntity.id,
            ...store,
            category,
            subCategory,
            location,
            users,
        });

        let updatedStore = storeEntity.toDto();
        updatedStore = { ...updatedStore, ...store };

        return updatedStore;
    }

    async deleteStore(id: string) {
        const storeEntity = await this.findOne({ id });
        if (!storeEntity) {
            throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
        }
        await this.storeRepository.delete({
            id: storeEntity.id,
        });
        return storeEntity.toDto();
    }

    private async validateRequestInputs(
        requestDto: Partial<CreateStoreDto>,
        locationID?: string,
    ) {
        let locationDto: LocationDto;
        let category: CategoryDto;
        let subCategory: SubCategoryDto;
        let usersDto: UserDto[];
        const { categoryID, subCategoryID, users, location } = requestDto;
        if (categoryID) {
            category = await this.categoryService.getCategory(categoryID);
        }
        if (subCategoryID) {
            subCategory = await this.subCategoryService.getSubCategory(
                subCategoryID,
                categoryID,
            );
        }
        if (users) {
            for (const u of users) {
                const uDto = await this.userService.getUser(u.id);
                usersDto.push(uDto);
            }
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
            users: usersDto,
            location: locationDto,
        };
    }
}
