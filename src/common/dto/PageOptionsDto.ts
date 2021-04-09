/* eslint-disable max-classes-per-file */
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

export class Filter {
    name: string;
    value: string;
}
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

    @Field({ nullable: true })
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly sort?: string;

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
    readonly filter?: string;

    get filters(): Filter[] {
        return this.filter
            ? this.filter.split(',').map((val) => {
                  const filter = val.split('=');
                  return {
                      name: filter[0],
                      value: filter[1],
                  };
              })
            : [];
    }

    @Field({ nullable: true })
    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly q?: string;
}
