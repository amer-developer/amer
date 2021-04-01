import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

import { Order } from '../constants/order';
@ArgsType()
export class PageOptionsDto {
    @Field(() => Order)
    @ApiPropertyOptional({
        enum: Order,
        default: Order.ASC,
    })
    @IsEnum(Order)
    @IsOptional()
    readonly order: Order = Order.ASC;

    @Field(() => Int)
    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page: number = 1;

    @Field(() => Int)
    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly take: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }

    @Field({ nullable: true })
    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly include: string;

    get includes(): string[] {
        return this.include
            ? this.include.endsWith(',')
                ? this.include.split(',').splice(0, 1)
                : this.include.split(',')
            : [];
    }

    @Field({ nullable: true })
    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly q?: string;
}
