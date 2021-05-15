import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { OfferStatus } from '../../common/constants/offer-status';
import { RequestStatus } from '../../common/constants/request-status';
import { RoleType } from '../../common/constants/role-type';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { OfferNotValidException } from '../../exceptions/offer-not-valid.exception';
import { UserEntity } from '../user/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';
import { OffersPageOptionsDto } from './dto/offers-page-options.dto';
import { OffersPageDto } from './dto/offers-page.dto';
import { RejectOfferDto } from './dto/reject-offer.dto';
import { UpdateOfferInput } from './dto/update-offer.dto';
import { OfferService } from './offer.service';

@Resolver(() => OfferDto)
export class OfferResolver {
    private logger = new Logger(OfferResolver.name);

    constructor(private offerService: OfferService) {}

    @Mutation(() => OfferDto, { name: 'createOffer' })
    @Auth(RoleType.BUYER, RoleType.ADMIN)
    createOffer(
        @Args()
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
        return this.offerService.createOffer(offer);
    }
    @Query(() => OffersPageDto, { name: 'offers' })
    getOffers(
        @Args()
        pageOptionsDto: OffersPageOptionsDto,
    ): Promise<OffersPageDto> {
        return this.offerService.getOffers(pageOptionsDto);
    }

    @Query(() => OfferDto, { name: 'offer' })
    getOffer(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args({ nullable: true }) getOptionsDto: GetOptionsDto,
    ): Promise<OfferDto> {
        return this.offerService.getOffer(id, {
            relations: getOptionsDto.includes,
        });
    }

    @Mutation(() => OfferDto, { name: 'updateOffer' })
    @Auth(RoleType.BUYER, RoleType.ADMIN)
    updateOffer(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() offer: UpdateOfferInput,
        @AuthUser() user: UserEntity,
    ): Promise<OfferDto> {
        if (user.role !== RoleType.ADMIN) {
            offer.ownerID = user.id;
            offer.storeID = user.store?.id;
        }
        this.logger.debug(
            `Update offer, user: ${user.id}, offer ${JSON.stringify(offer)}`,
        );

        return this.offerService.updateOffer(id, offer);
    }

    @Mutation(() => OfferDto, { name: 'acceptOffer' })
    @Auth(RoleType.BUYER, RoleType.ADMIN)
    async acceptOffer(
        @Args('id', new ParseUUIDPipe()) offerId: string,
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

    @Mutation(() => OfferDto, { name: 'rejectOffer' })
    @Auth(RoleType.BUYER, RoleType.ADMIN)
    async rejectOffer(
        @Args('id', new ParseUUIDPipe()) offerId: string,
        @Args() offer: RejectOfferDto,
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
            rejectCode: offer.code,
            rejectMessage: offer.message,
        });

        rejectedOffer.status = OfferStatus.REJECTED;
        rejectedOffer.rejectCode = offer.code;
        rejectedOffer.rejectMessage = offer.message;

        return rejectedOffer;
    }

    @Mutation(() => OfferDto, { name: 'deleteOffer' })
    @Auth(RoleType.ADMIN)
    deleteOffer(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<OfferDto> {
        this.logger.debug(`Delete offer, user: ${user.id}, offer: ${id}`);

        return this.offerService.deleteOffer(id);
    }
}
