'use strict';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

import { StoreStatus } from '../../../common/constants/store-status';
import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CategoryDto } from '../../category/dto/category.dto';
import { LocationDto } from '../../location/dto/location.dto';
import { SubCategoryDto } from '../../sub-category/dto/sub-category.dto';
import { UserDto } from '../../user/dto/user.dto';
import { StoreEntity } from '../store.entity';

@ObjectType()
export class StoreDto extends AbstractDto {
    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsNumber()
    @Type(() => Number)
    reference: number;

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsString()
    name: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    bio: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    avatar: string;

    @Field(() => CategoryDto, { nullable: false })
    @ApiProperty({ required: false })
    @IsObject()
    category: CategoryDto;

    @Field(() => SubCategoryDto, { nullable: false })
    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    subCategory: SubCategoryDto;

    @Field(() => LocationDto, { nullable: true })
    @ApiProperty({ required: true, type: () => LocationDto })
    @IsOptional()
    @IsObject()
    location: LocationDto;

    @Field(() => [UserDto], { nullable: true })
    @ApiProperty({
        required: false,
        isArray: true,
        type: () => UserDto,
    })
    @IsArray()
    @IsOptional()
    @Type(() => UserDto)
    @ValidateNested({ each: true })
    users: UserDto[];

    @Field(() => StoreStatus, { nullable: true })
    @ApiProperty({
        required: true,
        enum: StoreStatus,
        default: StoreStatus.ACTIVE,
    })
    @IsEnum(StoreStatus)
    @IsOptional()
    status: StoreStatus;

    constructor(store: StoreEntity) {
        super(store);
        this.reference = store.reference;
        this.name = store.name;
        this.bio = store.bio;
        this.avatar = store.avatar;
        if (store.category) {
            this.category = store.category.toDto();
        }
        if (store.subCategory) {
            this.subCategory = store.subCategory.toDto();
        }
        if (store.location) {
            this.location = store.location.toDto();
        }
        this.status = store.status;
        if (store.users) {
            this.users = store.users.toDtos();
        }
    }
}
