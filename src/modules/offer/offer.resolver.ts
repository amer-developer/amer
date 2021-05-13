import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { GetOptionsDto } from '../../common/dto/GetOptionsDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';
import { OffersPageOptionsDto } from './dto/offers-page-options.dto';
import { OffersPageDto } from './dto/offers-page.dto';
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
        return this.offerService.getOffer(id, getOptionsDto);
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
        }
        this.logger.debug(
            `Update offer, user: ${user.id}, offer ${JSON.stringify(offer)}`,
        );

        return this.offerService.updateOffer(id, offer);
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
