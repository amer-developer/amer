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
import { CreateSMSDto } from './dto/create-sms.dto';
import { SMSPageOptionsDto } from './dto/sms-page-options.dto';
import { SMSPageDto } from './dto/sms-page.dto';
import { SMSSentRo } from './dto/sms-send.ro';
import { SMSDto } from './dto/sms.dto';
import { UpdateSMSDto } from './dto/update-sms.dto';
import { SMSService } from './sms.service';

@Controller('sms')
@ApiTags('sms')
export class SMSController {
    private logger = new Logger(SMSController.name);
    constructor(private smsService: SMSService) {}

    @Post()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New sms',
        type: SMSSentRo,
    })
    async sendSMS(
        @Body()
        sms: CreateSMSDto,
    ): Promise<SMSSentRo> {
        this.logger.debug(`Creating a new sms, sms ${JSON.stringify(sms)}`);
        return this.smsService.sendSMS(sms);
    }

    @Get()
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get sms list',
        type: SMSPageDto,
    })
    getSMSList(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: SMSPageOptionsDto,
    ): Promise<SMSPageDto> {
        return this.smsService.getSMSList(pageOptionsDto);
    }

    @Get(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a sms',
        type: SMSDto,
    })
    getSMS(@UUIDParam('id') smsId: string): Promise<SMSDto> {
        return this.smsService.getSMS(smsId);
    }

    @Put(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated sms',
        type: SMSDto,
    })
    updateSMS(
        @UUIDParam('id') smsId: string,
        @Body() sms: UpdateSMSDto,
        @AuthUser() user: UserEntity,
    ): Promise<SMSDto> {
        this.logger.debug(
            `Update sms, user: ${user.id}, sms ${JSON.stringify(sms)}`,
        );

        return this.smsService.updateSMS(smsId, sms);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted sms',
        type: SMSDto,
    })
    deleteSMS(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<SMSDto> {
        this.logger.debug(`Delete sms, user: ${user.id}, sms: ${id}`);

        return this.smsService.deleteSMS(id);
    }
}
