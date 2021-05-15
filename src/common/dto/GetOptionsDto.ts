/* eslint-disable max-classes-per-file */
import { ArgsType, Field } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Filter {
    name: string;
    value: string;
}
@ArgsType()
export class GetOptionsDto {
    @Field({ nullable: true })
    @ApiPropertyOptional()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    include?: string;

    get includes(): string[] {
        return this.include
            ? this.include.endsWith(',')
                ? this.include.split(',').splice(0, 1)
                : this.include.split(',')
            : [];
    }
}
