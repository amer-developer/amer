import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

// import { Trim } from '../../../decorators/transforms.decorator';

export class UserRegisterDto {
    @ApiProperty({ minLength: 4 })
    @IsString()
    readonly firstName: string;

    @ApiProperty({ minLength: 4 })
    @IsString()
    readonly lastName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsOptional()
    readonly email: string;

    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    readonly password: string;

    @ApiProperty()
    @Column()
    @IsPhoneNumber('ZZ')
    @IsOptional()
    phone: string;
}
