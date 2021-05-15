import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindOneOptions } from 'typeorm';

import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { CategoryNotFoundException } from '../../exceptions/category-not-found.exception';
import { ValidatorService } from '../../shared/services/validator.service';
import { ImageDto } from '../image/dto/image.dto';
import { ImageService } from '../image/image.service';
import { CategoryEntity } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CategoriesPageOptionsDto } from './dto/categories-page-options.dto';
import { CategoriesPageDto } from './dto/categories-page.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    private logger = new Logger(CategoryService.name);
    constructor(
        public readonly categoryRepository: CategoryRepository,
        public readonly validatorService: ValidatorService,
        public readonly imagesService: ImageService,
    ) {}

    /**
     * Find single category
     */
    findOne(
        findData: FindConditions<CategoryEntity>,
        findOptions?: FindOneOptions<CategoryEntity>,
    ): Promise<CategoryEntity> {
        return this.categoryRepository.findOne(findData, findOptions);
    }

    async createCategory(categoryDto: CreateCategoryDto): Promise<CategoryDto> {
        const category = this.categoryRepository.create(categoryDto);

        const savedEntity = await this.categoryRepository.save(category);
        return savedEntity.toDto();
    }

    async getCategories(
        pageOptionsDto: CategoriesPageOptionsDto,
    ): Promise<CategoriesPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.categoryRepository.createQueryBuilder(
            'category',
        );

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(pageOptionsDto.q, [
                'nameAR',
                'nameEN',
            ]);
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getCategory(id: string, options?: GetOptionsDto) {
        options.include = options.include ?? '';
        options.include =
            options.include.indexOf('icon') >= 0
                ? options.include
                : (options.include += ',icon');
        const categoryEntity = await this.findOne(
            { id },
            { relations: options?.includes },
        );

        if (!categoryEntity) {
            throw new CategoryNotFoundException();
        }

        return categoryEntity.toDto();
    }

    async updateCategory(id: string, category: UpdateCategoryDto) {
        const categoryEntity = await this.findOne({ id });
        if (!categoryEntity) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        let icon: ImageDto;
        if (category.icon) {
            icon = await this.imagesService.getImage(category.icon.id);
        }

        await this.categoryRepository.save({
            id: categoryEntity.id,
            ...category,
            icon,
        });

        let updatedCategory = categoryEntity.toDto();
        updatedCategory = { ...updatedCategory, ...category };

        return updatedCategory;
    }

    async deleteCategory(id: string) {
        const categoryEntity = await this.findOne({ id });
        if (!categoryEntity) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        await this.categoryRepository.delete({
            id: categoryEntity.id,
        });
        return categoryEntity.toDto();
    }
}
