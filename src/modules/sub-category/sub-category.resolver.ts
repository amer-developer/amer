import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { SubCategoriesPageOptionsDto } from './dto/sub-categories-page-options.dto';
import { SubCategoriesPageDto } from './dto/sub-categories-page.dto';
import { SubCategoryDto } from './dto/sub-category.dto';
import { UpdateSubCategoryInput } from './dto/update-sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@Resolver(() => SubCategoryDto)
export class SubCategoryResolver {
    private logger = new Logger(SubCategoryResolver.name);

    constructor(private subCategoryService: SubCategoryService) {}

    @Mutation(() => SubCategoryDto, { name: 'createSubCategory' })
    @Auth(RoleType.ADMIN)
    createSubCategory(
        @Args()
        subCategory: CreateSubCategoryDto,
        @AuthUser() user: UserEntity,
    ): Promise<SubCategoryDto> {
        this.logger.debug(
            `Creating a new subCategory, user: ${
                user.id
            }, subCategory ${JSON.stringify(subCategory)}`,
        );
        return this.subCategoryService.createSubCategory(subCategory);
    }
    @Query(() => SubCategoriesPageDto, { name: 'subCategories' })
    getSubCategories(
        @Args()
        pageOptionsDto: SubCategoriesPageOptionsDto,
    ): Promise<SubCategoriesPageDto> {
        return this.subCategoryService.getSubCategories(pageOptionsDto);
    }

    @Query(() => SubCategoryDto, { name: 'subCategory' })
    getSubCategory(
        @Args('id', new ParseUUIDPipe()) id: string,
    ): Promise<SubCategoryDto> {
        return this.subCategoryService.getSubCategory(id);
    }

    @Mutation(() => SubCategoryDto, { name: 'updateSubCategory' })
    @Auth(RoleType.ADMIN)
    updateSubCategory(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() subCategory: UpdateSubCategoryInput,
        @AuthUser() user: UserEntity,
    ): Promise<SubCategoryDto> {
        this.logger.debug(
            `Update subCategory, user: ${user.id}, subCategory ${JSON.stringify(
                subCategory,
            )}`,
        );

        return this.subCategoryService.updateSubCategory(id, subCategory);
    }

    @Mutation(() => SubCategoryDto, { name: 'deleteSubCategory' })
    @Auth(RoleType.ADMIN)
    deleteSubCategory(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<SubCategoryDto> {
        this.logger.debug(
            `Delete subCategory, user: ${user.id}, subCategory: ${id}`,
        );

        return this.subCategoryService.deleteSubCategory(id);
    }
}
