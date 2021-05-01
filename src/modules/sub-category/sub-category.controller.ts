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
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { SubCategoriesPageOptionsDto } from './dto/sub-categories-page-options.dto';
import { SubCategoriesPageDto } from './dto/sub-categories-page.dto';
import { SubCategoryDto } from './dto/sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoryService } from './sub-category.service';

@Controller('sub-categories')
@ApiTags('sub-categories')
export class SubCategoryController {
    private logger = new Logger(SubCategoryController.name);
    constructor(private subCategoryService: SubCategoryService) {}

    @Post()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New subCategory',
        type: SubCategoriesPageDto,
    })
    createSubCategory(
        @Body()
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

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get subCategories list',
        type: SubCategoriesPageDto,
    })
    getSubCategories(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: SubCategoriesPageOptionsDto,
    ): Promise<SubCategoriesPageDto> {
        return this.subCategoryService.getSubCategories(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a subCategory',
        type: SubCategoryDto,
    })
    getSubCategory(
        @UUIDParam('id') subCategoryId: string,
    ): Promise<SubCategoryDto> {
        return this.subCategoryService.getSubCategory(subCategoryId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated subCategory',
        type: SubCategoryDto,
    })
    updateSubCategory(
        @UUIDParam('id') subCategoryId: string,
        @Body() subCategory: UpdateSubCategoryDto,
        @AuthUser() user: UserEntity,
    ): Promise<SubCategoryDto> {
        this.logger.debug(
            `Update subCategory, user: ${user.id}, subCategory ${JSON.stringify(
                subCategory,
            )}`,
        );

        return this.subCategoryService.updateSubCategory(
            subCategoryId,
            subCategory,
        );
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted subCategory',
        type: SubCategoryDto,
    })
    deleteSubCategory(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<SubCategoryDto> {
        this.logger.debug(
            `Delete subCategory, user: ${user.id}, subCategory: ${id}`,
        );

        return this.subCategoryService.deleteSubCategory(id);
    }
}
