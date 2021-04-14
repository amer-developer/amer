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
import { CreateOtpDto } from './dto/create-otp.dto';
import { OtpPageOptionsDto } from './dto/otp-page-options.dto';
import { OtpPageDto } from './dto/otp-page.dto';
import { OtpSentRo } from './dto/otp-send.ro';
import { OtpDto } from './dto/otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
@ApiTags('otp')
export class OtpController {
    private logger = new Logger(OtpController.name);
    constructor(private otpService: OtpService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New otp',
        type: OtpSentRo,
    })
    async sendOtp(
        @Body()
        otp: CreateOtpDto,
    ): Promise<OtpSentRo> {
        this.logger.debug(`Creating a new otp, otp ${JSON.stringify(otp)}`);
        return this.otpService.sendOtp(otp);
    }

    @Post('validate')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New otp',
        type: OtpSentRo,
    })
    async validate(
        @Body()
        otp: ValidateOtpDto,
    ): Promise<OtpSentRo> {
        this.logger.debug(`Validating an otp, otp ${JSON.stringify(otp)}`);
        return this.otpService.validateOTP(otp);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get otp list',
        type: OtpPageDto,
    })
    getOtpList(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: OtpPageOptionsDto,
    ): Promise<OtpPageDto> {
        return this.otpService.getOtpList(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a otp',
        type: OtpDto,
    })
    getOtp(@UUIDParam('id') otpId: string): Promise<OtpDto> {
        return this.otpService.getOtp(otpId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated otp',
        type: OtpDto,
    })
    updateOtp(
        @UUIDParam('id') otpId: string,
        @Body() otp: UpdateOtpDto,
        @AuthUser() user: UserEntity,
    ): Promise<OtpDto> {
        this.logger.debug(
            `Update otp, user: ${user.id}, otp ${JSON.stringify(otp)}`,
        );

        return this.otpService.updateOtp(otpId, otp);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted otp',
        type: OtpDto,
    })
    deleteOtp(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<OtpDto> {
        this.logger.debug(`Delete otp, user: ${user.id}, otp: ${id}`);

        return this.otpService.deleteOtp(id);
    }
}
