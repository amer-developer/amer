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
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestDto } from './dto/request.dto';
import { RequestsPageOptionsDto } from './dto/requests-page-options.dto';
import { RequestsPageDto } from './dto/requests-page.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestService } from './request.service';

@Controller('requests')
@ApiTags('requests')
export class RequestController {
    private logger = new Logger(RequestController.name);
    constructor(private requestService: RequestService) {}

    @Post()
    @Auth(RoleType.BUYER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New request',
        type: RequestDto,
    })
    createRequest(
        @Body()
        request: CreateRequestDto,
        @AuthUser() user: UserEntity,
    ): Promise<RequestDto> {
        this.logger.debug(
            `Creating a new request, user: ${user.id}, request ${JSON.stringify(
                request,
            )}`,
        );
        return this.requestService.createRequest(request, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get requests list',
        type: RequestsPageDto,
    })
    getRequests(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: RequestsPageOptionsDto,
    ): Promise<RequestsPageDto> {
        return this.requestService.getRequests(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a request',
        type: RequestDto,
    })
    getRequest(@UUIDParam('id') requestId: string): Promise<RequestDto> {
        return this.requestService.getRequest(requestId);
    }

    @Put(':id')
    @Auth(RoleType.BUYER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated request',
        type: RequestDto,
    })
    updateRequest(
        @UUIDParam('id') requestId: string,
        @Body() request: UpdateRequestDto,
        @AuthUser() user: UserEntity,
    ): Promise<RequestDto> {
        this.logger.debug(
            `Update request, user: ${user.id}, request ${JSON.stringify(
                request,
            )}`,
        );

        return this.requestService.updateRequest(requestId, request);
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted request',
        type: RequestDto,
    })
    deleteRequest(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<RequestDto> {
        this.logger.debug(`Delete request, user: ${user.id}, request: ${id}`);

        return this.requestService.deleteRequest(id);
    }
}
