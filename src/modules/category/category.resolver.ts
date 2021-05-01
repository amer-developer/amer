import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CategoryService } from './category.service';
import { CategoriesPageOptionsDto } from './dto/categories-page-options.dto';
import { CategoriesPageDto } from './dto/categories-page.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryInput } from './dto/update-category.dto';

@Resolver(() => CategoryDto)
export class CategoryResolver {
    private logger = new Logger(CategoryResolver.name);

    constructor(private categoryService: CategoryService) {}

    @Mutation(() => CategoryDto, { name: 'createCategory' })
    @Auth(RoleType.ADMIN)
    createCategory(
        @Args()
        category: CreateCategoryDto,
        @AuthUser() user: UserEntity,
    ): Promise<CategoryDto> {
        this.logger.debug(
            `Creating a new category, user: ${
                user.id
            }, category ${JSON.stringify(category)}`,
        );
        return this.categoryService.createCategory(category);
    }
    @Query(() => CategoriesPageDto, { name: 'categories' })
    getCategories(
        @Args()
        pageOptionsDto: CategoriesPageOptionsDto,
    ): Promise<CategoriesPageDto> {
        return this.categoryService.getCategories(pageOptionsDto);
    }

    @Query(() => CategoryDto, { name: 'category' })
    getCategory(
        @Args('id', new ParseUUIDPipe()) id: string,
    ): Promise<CategoryDto> {
        return this.categoryService.getCategory(id);
    }

    @Mutation(() => CategoryDto, { name: 'updateCategory' })
    @Auth(RoleType.ADMIN)
    updateCategory(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() category: UpdateCategoryInput,
        @AuthUser() user: UserEntity,
    ): Promise<CategoryDto> {
        this.logger.debug(
            `Update category, user: ${user.id}, category ${JSON.stringify(
                category,
            )}`,
        );

        return this.categoryService.updateCategory(id, category);
    }

    @Mutation(() => CategoryDto, { name: 'deleteCategory' })
    @Auth(RoleType.ADMIN)
    deleteCategory(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<CategoryDto> {
        this.logger.debug(`Delete category, user: ${user.id}, category: ${id}`);

        return this.categoryService.deleteCategory(id);
    }
}
