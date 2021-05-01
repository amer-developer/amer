import { Injectable, Logger } from '@nestjs/common';
import { FindConditions, FindOneOptions } from 'typeorm';

import { CategoryNotFoundException } from '../../exceptions/category-not-found.exception';
import { SubCategoryNotFoundException } from '../../exceptions/sub-category-not-found.exception';
import { ValidatorService } from '../../shared/services/validator.service';
import { CategoryService } from '../category/category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { SubCategoriesPageOptionsDto } from './dto/sub-categories-page-options.dto';
import { SubCategoriesPageDto } from './dto/sub-categories-page.dto';
import { SubCategoryDto } from './dto/sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoryEntity } from './sub-category.entity';
import { SubCategoryRepository } from './sub-category.repository';

@Injectable()
export class SubCategoryService {
    private logger = new Logger(SubCategoryService.name);
    constructor(
        public readonly subCategoryRepository: SubCategoryRepository,
        public readonly validatorService: ValidatorService,
        public readonly countriesService: CategoryService,
    ) {}

    /**
     * Find single subCategory
     */
    findOne(
        findData: FindConditions<SubCategoryEntity>,
        findOpts?: FindOneOptions<SubCategoryEntity>,
    ): Promise<SubCategoryEntity> {
        return this.subCategoryRepository.findOne(findData, findOpts);
    }

    async createSubCategory(
        subCategoryDto: CreateSubCategoryDto,
    ): Promise<SubCategoryDto> {
        const category = await this.countriesService.findOne({
            id: subCategoryDto.categoryID,
        });
        if (!category) {
            throw new CategoryNotFoundException();
        }
        const subCategory = this.subCategoryRepository.create({
            ...subCategoryDto,
            category,
        });

        const savedEntity = await this.subCategoryRepository.save(subCategory);
        return savedEntity.toDto();
    }

    async getSubCategories(
        pageOptionsDto: SubCategoriesPageOptionsDto,
    ): Promise<SubCategoriesPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.subCategoryRepository.createQueryBuilder(
            'subCategory',
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

    async getSubCategory(id: string) {
        const subCategoryEntity = await this.findOne({ id });

        return subCategoryEntity.toDto();
    }

    async updateSubCategory(id: string, subCategory: UpdateSubCategoryDto) {
        const subCategoryEntity = await this.findOne({ id });
        if (!subCategoryEntity) {
            throw new SubCategoryNotFoundException();
        }

        await this.subCategoryRepository.save({
            id: subCategoryEntity.id,
            ...subCategory,
        });

        let updatedSubCategory = subCategoryEntity.toDto();
        updatedSubCategory = { ...updatedSubCategory, ...subCategory };

        return updatedSubCategory;
    }

    async deleteSubCategory(id: string) {
        const subCategoryEntity = await this.findOne({ id });
        if (!subCategoryEntity) {
            throw new SubCategoryNotFoundException();
        }
        await this.subCategoryRepository.delete({
            id: subCategoryEntity.id,
        });
        return subCategoryEntity.toDto();
    }
}
