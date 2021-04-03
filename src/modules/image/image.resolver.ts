import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageDto } from './dto/image.dto';
import { ImagesPageOptionsDto } from './dto/images-page-options.dto';
import { ImagesPageDto } from './dto/images-page.dto';
import { UpdateImageInput } from './dto/update-image.dto';
import { ImageService } from './image.service';

@Resolver(() => ImageDto)
export class ImageResolver {
    private logger = new Logger(ImageResolver.name);

    constructor(private imageService: ImageService) {}

    @Mutation(() => ImageDto, { name: 'createImage' })
    @Auth(RoleType.ADMIN)
    createImage(
        @Args()
        image: CreateImageDto,
        @AuthUser() user: UserEntity,
    ): Promise<ImageDto> {
        this.logger.debug(
            `Creating a new image, user: ${user.id}, image ${JSON.stringify(
                image,
            )}`,
        );
        return this.imageService.createImage(image);
    }
    @Query(() => ImagesPageDto, { name: 'images' })
    getImages(
        @Args()
        pageOptionsDto: ImagesPageOptionsDto,
    ): Promise<ImagesPageDto> {
        return this.imageService.getImages(pageOptionsDto);
    }

    @Query(() => ImageDto, { name: 'image' })
    getImage(@Args('id', new ParseUUIDPipe()) id: string): Promise<ImageDto> {
        return this.imageService.getImage(id);
    }

    @Mutation(() => ImageDto, { name: 'updateImage' })
    @Auth(RoleType.ADMIN)
    updateImage(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() image: UpdateImageInput,
        @AuthUser() user: UserEntity,
    ): Promise<ImageDto> {
        this.logger.debug(
            `Update image, user: ${user.id}, image ${JSON.stringify(image)}`,
        );

        return this.imageService.updateImage(id, image);
    }

    @Mutation(() => ImageDto, { name: 'deleteImage' })
    @Auth(RoleType.ADMIN)
    deleteImage(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<ImageDto> {
        this.logger.debug(`Delete image, user: ${user.id}, image: ${id}`);

        return this.imageService.deleteImage(id);
    }
}
