'use strict';
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';

import { StoreStatus } from '../../../common/constants/store-status';
import { CreateLocationDto } from '../../location/dto/create-location.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';

@ArgsType()
export class CreateStoreDto {
    @Field()
    @ApiProperty({ minLength: 4 })
    @IsString()
    readonly name: string;

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

    @Field({ nullable: false })
    @ApiProperty({ required: true })
    @IsUUID()
    categoryID: string;

    @Field({ nullable: true })
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    subCategoryID: string;

    @Field(() => CreateLocationDto, { nullable: false })
    @ApiProperty({ required: true, type: () => CreateLocationDto })
    @Type(() => CreateLocationDto)
    @IsObject({ each: true })
    @ValidateNested()
    location: CreateLocationDto;

    @Field(() => [CreateUserDto], { nullable: true })
    @ApiProperty({
        required: false,
        isArray: true,
        type: () => CreateUserDto,
    })
    @IsArray()
    @IsOptional()
    @Type(() => CreateUserDto)
    @ValidateNested({ each: true })
    users: CreateUserDto[];

    @Field(() => StoreStatus, { nullable: true })
    @ApiProperty({
        required: true,
        enum: StoreStatus,
        default: StoreStatus.ACTIVE,
    })
    @IsEnum(StoreStatus)
    @IsOptional()
    status: StoreStatus = StoreStatus.ACTIVE;
}
