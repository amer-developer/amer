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
    ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CategoryService } from './category.service';
import { CategoriesPageOptionsDto } from './dto/categories-page-options.dto';
import { CategoriesPageDto } from './dto/categories-page.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
    private logger = new Logger(CategoryController.name);
    constructor(private categoryService: CategoryService) {}

    @Post()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New category',
        type: CategoriesPageDto,
    })
    createCategory(
        @Body()
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

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get categories list',
        type: CategoriesPageDto,
    })
    getCategories(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: CategoriesPageOptionsDto,
    ): Promise<CategoriesPageDto> {
        return this.categoryService.getCategories(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a category',
        type: CategoryDto,
    })
    getCategory(@UUIDParam('id') categoryId: string): Promise<CategoryDto> {
        return this.categoryService.getCategory(categoryId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated category',
        type: CategoryDto,
    })
    updateCategory(
        @UUIDParam('id') categoryId: string,
        @Body() category: UpdateCategoryDto,
        @AuthUser() user: UserEntity,
    ): Promise<CategoryDto> {
        this.logger.debug(
            `Update category, user: ${user.id}, category ${JSON.stringify(
                category,
            )}`,
        );

        return this.categoryService.updateCategory(categoryId, category);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted category',
        type: CategoryDto,
    })
    deleteCategory(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<CategoryDto> {
        this.logger.debug(`Delete category, user: ${user.id}, category: ${id}`);

        return this.categoryService.deleteCategory(id);
    }
}
