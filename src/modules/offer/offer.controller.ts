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

import { OfferStatus } from '../../common/constants/offer-status';
import { RequestStatus } from '../../common/constants/request-status';
import { RoleType } from '../../common/constants/role-type';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { OfferNotValidException } from '../../exceptions/offer-not-valid.exception';
import { UserEntity } from '../user/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';
import { OffersPageOptionsDto } from './dto/offers-page-options.dto';
import { OffersPageDto } from './dto/offers-page.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferService } from './offer.service';

@Controller('offers')
@ApiTags('offers')
export class OfferController {
    private logger = new Logger(OfferController.name);
    constructor(private offerService: OfferService) {}

    @Post()
    @Auth(RoleType.SELLER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'New offer',
        type: OfferDto,
    })
    createOffer(
        @Body()
        offer: CreateOfferDto,
        @AuthUser() user: UserEntity,
    ): Promise<OfferDto> {
        if (user.role !== RoleType.ADMIN) {
            offer.ownerID = user.id;
            offer.storeID = user.store?.id;
        }
        this.logger.debug(
            `Creating a new offer, user: ${user.id}, offer ${JSON.stringify(
                offer,
            )}`,
        );
        this.logger.debug(offer.images);
        return this.offerService.createOffer(offer);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get offers list',
        type: OffersPageDto,
    })
    getOffers(
        @Query(new ValidationPipe({ transform: true }))
        pageOptionsDto: OffersPageOptionsDto,
    ): Promise<OffersPageDto> {
        return this.offerService.getOffers(pageOptionsDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get a offer',
        type: OfferDto,
    })
    getOffer(
        @UUIDParam('id') offerId: string,
        @Query(new ValidationPipe({ transform: true }))
        getOptionsDto?: GetOptionsDto,
    ): Promise<OfferDto> {
        return this.offerService.getOffer(offerId, {
            relations: getOptionsDto.includes,
        });
    }

    @Put(':id')
    @Auth(RoleType.SELLER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Updated offer',
        type: OfferDto,
    })
    updateOffer(
        @UUIDParam('id') offerId: string,
        @Body() offer: UpdateOfferDto,
        @AuthUser() user: UserEntity,
    ): Promise<OfferDto> {
        if (user.role !== RoleType.ADMIN) {
            offer.ownerID = user.id;
            offer.storeID = user.store?.id;
        }

        this.logger.debug(
            `Update offer, user: ${user.id}, offer ${JSON.stringify(offer)}`,
        );

        return this.offerService.updateOffer(offerId, offer);
    }

    @Put(':id/accept')
    @Auth(RoleType.SELLER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Accepted offer',
        type: OfferDto,
    })
    async acceptOffer(
        @UUIDParam('id') offerId: string,
        @AuthUser() user: UserEntity,
    ): Promise<OfferDto> {
        this.logger.debug(`Aceept offer, user: ${user.id}, offer ${offerId}`);

        const acceptedOffer = await this.offerService.getOffer(offerId, {
            relations: ['request', 'request.owner', 'store', 'images', 'owner'],
        });
        if (
            user.role !== RoleType.ADMIN &&
            user.id !== acceptedOffer.request.owner.id
        ) {
            // Unauth op
            this.logger.error('Unauth error #1');
            return;
        }

        // Accept only active request and active offer
        if (
            acceptedOffer.status !== OfferStatus.ACTIVE ||
            acceptedOffer.request.status !== RequestStatus.ACTIVE
        ) {
            // Biz error
            this.logger.error('Biz error #2');
            throw new OfferNotValidException();
        }

        this.logger.debug(
            `Aceeptetd offer, user: ${user.id}, offer ${JSON.stringify(
                acceptedOffer,
            )}`,
        );

        // Should be transaction
        // Update offer
        await this.offerService.save({
            id: offerId,
            status: OfferStatus.ACCEPTED,
        });

        // Update request
        await this.offerService.requestService.save({
            id: acceptedOffer.request.id,
            status: RequestStatus.ACCEPTED_COMPLETED,
        });

        acceptedOffer.status = OfferStatus.ACCEPTED;

        return acceptedOffer;
    }

    @Put(':id/reject')
    @Auth(RoleType.SELLER, RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Rejected offer',
        type: OfferDto,
    })
    async rejectOffer(
        @UUIDParam('id') offerId: string,
        @AuthUser() user: UserEntity,
    ): Promise<OfferDto> {
        this.logger.debug(`Reject offer, user: ${user.id}, offer ${offerId}`);

        const rejectedOffer = await this.offerService.getOffer(offerId, {
            relations: ['request', 'request.owner', 'store', 'images', 'owner'],
        });
        if (
            user.role !== RoleType.ADMIN &&
            user.id !== rejectedOffer.request.owner.id
        ) {
            // Unauth op
            this.logger.error('Unauth error #1');
            return;
        }

        // Reject only active request and active offer
        if (
            rejectedOffer.status !== OfferStatus.ACTIVE ||
            rejectedOffer.request.status !== RequestStatus.ACTIVE
        ) {
            // Biz error
            this.logger.error('Biz error #2');
            throw new OfferNotValidException();
        }

        this.logger.debug(
            `Rejectetd offer, user: ${user.id}, offer ${JSON.stringify(
                rejectedOffer,
            )}`,
        );

        // Should be transaction
        // Update offer
        await this.offerService.save({
            id: offerId,
            status: OfferStatus.REJECTED,
        });

        rejectedOffer.status = OfferStatus.REJECTED;

        return rejectedOffer;
    }

    @Delete(':id')
    @Auth(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Deleted offer',
        type: OfferDto,
    })
    deleteOffer(
        @UUIDParam('id') id: string,
        @AuthUser() user: UserEntity,
    ): Promise<OfferDto> {
        this.logger.debug(`Delete offer, user: ${user.id}, offer: ${id}`);

        return this.offerService.deleteOffer(id);
    }
}
