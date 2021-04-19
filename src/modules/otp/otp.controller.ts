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
import { CreateOTPDto } from './dto/create-otp.dto';
import { OTPPageOptionsDto } from './dto/otp-page-options.dto';
import { OTPPageDto } from './dto/otp-page.dto';
import { OTPSentRo } from './dto/otp-send.ro';
import { OTPDto } from './dto/otp.dto';
import { UpdateOTPDto } from './dto/update-otp.dto';
import { ValidateOTPDto } from './dto/validate-otp.dto';
import { OTPService } from './otp.service';

@Controller('otp')
@ApiTags('otp')
export class OTPController {
    private logger = new Logger(OTPController.name);
    constructor(private otpService: OTPService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New otp',
        type: OTPSentRo,
    })
    async sendOTP(
        @Body()
        otp: CreateOTPDto,
    ): Promise<OTPSentRo> {
        this.logger.debug(`Creating a new otp, otp ${JSON.stringify(otp)}`);
        return this.otpService.sendOTP(otp);
    }

    @Post('validate')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New otp',
        type: OTPSentRo,
    })
    @Auth(RoleType.ADMIN)
    async validate(
        @Body()
        otp: ValidateOTPDto,
    ): Promise<OTPSentRo> {
        this.logger.debug(`Validating an otp, otp ${JSON.stringify(otp)}`);
        return this.otpService.validateOTP(otp);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get otp list',
        type: OTPPageDto,
    })
    @Auth(RoleType.ADMIN)
    getOTPList(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: OTPPageOptionsDto,
    ): Promise<OTPPageDto> {
        return this.otpService.getOTPList(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a otp',
        type: OTPDto,
    })
    @Auth(RoleType.ADMIN)
    getOTP(@UUIDParam('id') otpId: string): Promise<OTPDto> {
        return this.otpService.getOTP(otpId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated otp',
        type: OTPDto,
    })
    @Auth(RoleType.ADMIN)
    updateOTP(
        @UUIDParam('id') otpId: string,
        @Body() otp: UpdateOTPDto,
        @AuthUser() user: UserEntity,
    ): Promise<OTPDto> {
        this.logger.debug(
            `Update otp, user: ${user.id}, otp ${JSON.stringify(otp)}`,
        );

        return this.otpService.updateOTP(otpId, otp);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted otp',
        type: OTPDto,
    })
    @Auth(RoleType.ADMIN)
    deleteOTP(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<OTPDto> {
        this.logger.debug(`Delete otp, user: ${user.id}, otp: ${id}`);

        return this.otpService.deleteOTP(id);
    }
}
