import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestDto } from './dto/request.dto';
import { RequestsPageOptionsDto } from './dto/requests-page-options.dto';
import { RequestsPageDto } from './dto/requests-page.dto';
import { UpdateRequestInput } from './dto/update-request.dto';
import { RequestService } from './request.service';

@Resolver(() => RequestDto)
export class RequestResolver {
    private logger = new Logger(RequestResolver.name);

    constructor(private requestService: RequestService) {}

    @Mutation(() => RequestDto, { name: 'createRequest' })
    @Auth(RoleType.BUYER, RoleType.ADMIN)
    createRequest(
        @Args()
        request: CreateRequestDto,
        @AuthUser() user: UserEntity,
    ): Promise<RequestDto> {
        if (user.role !== RoleType.ADMIN) {
            delete request.ownerID;
        }
        this.logger.debug(
            `Creating a new request, user: ${user.id}, request ${JSON.stringify(
                request,
            )}`,
        );
        return this.requestService.createRequest(request, user.toDto());
    }
    @Query(() => RequestsPageDto, { name: 'requests' })
    getRequests(
        @Args()
        pageOptionsDto: RequestsPageOptionsDto,
    ): Promise<RequestsPageDto> {
        return this.requestService.getRequests(pageOptionsDto);
    }

    @Query(() => RequestDto, { name: 'request' })
    getRequest(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args({ nullable: true }) getOptionsDto: GetOptionsDto,
    ): Promise<RequestDto> {
        return this.requestService.getRequest(id, getOptionsDto);
    }

    @Mutation(() => RequestDto, { name: 'updateRequest' })
    @Auth(RoleType.BUYER, RoleType.ADMIN)
    updateRequest(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() request: UpdateRequestInput,
        @AuthUser() user: UserEntity,
    ): Promise<RequestDto> {
        if (user.role !== RoleType.ADMIN) {
            delete request.ownerID;
        }
        this.logger.debug(
            `Update request, user: ${user.id}, request ${JSON.stringify(
                request,
            )}`,
        );

        return this.requestService.updateRequest(id, request, user.toDto());
    }

    @Mutation(() => RequestDto, { name: 'deleteRequest' })
    @Auth(RoleType.ADMIN)
    deleteRequest(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<RequestDto> {
        this.logger.debug(`Delete request, user: ${user.id}, request: ${id}`);

        return this.requestService.deleteRequest(id);
    }
}
