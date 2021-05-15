import { Injectable, Logger } from '@nestjs/common';
import {
    DeepPartial,
    FindConditions,
    FindOneOptions,
    SaveOptions,
} from 'typeorm';

import { ImageFolder } from '../../common/constants/image-folder';
import { OfferStatus } from '../../common/constants/offer-status';
import { OfferNotFoundException } from '../../exceptions/offer-not-found.exception';
import { CreateImageDto } from '../image/dto/create-image.dto';
import { ImageService } from '../image/image.service';
import { RequestDto } from '../request/dto/request.dto';
import { RequestService } from '../request/request.service';
import { StoreDto } from '../store/dto/store.dto';
import { StoreService } from '../store/store.service';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';
import { OffersPageOptionsDto } from './dto/offers-page-options.dto';
import { OffersPageDto } from './dto/offers-page.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferEntity } from './offer.entity';
import { OfferRepository } from './offer.repository';

@Injectable()
export class OfferService {
    private logger = new Logger(OfferService.name);
    constructor(
        public readonly offerRepository: OfferRepository,
        public readonly requestService: RequestService,
        public readonly storeService: StoreService,
        public readonly imageService: ImageService,
        public readonly userService: UserService,
    ) {}

    /**
     * Find single offer
     */
    findOne(
        findData: FindConditions<OfferEntity>,
        findOneOptions?: FindOneOptions<OfferEntity>,
    ): Promise<OfferEntity> {
        return this.offerRepository.findOne(findData, findOneOptions);
    }

    save(
        entities: DeepPartial<OfferEntity>,
        opts?: SaveOptions,
    ): Promise<OfferEntity> {
        return this.offerRepository.save(entities, opts);
    }

    async createOffer(offerDto: CreateOfferDto): Promise<OfferDto> {
        const {
            store,
            request,
            images,
            owner,
        } = await this.validateOfferInputs(offerDto);

        const offer = this.offerRepository.create({
            ...offerDto,
            store,
            request,
            images,
            owner,
        });

        const savedEntity = await this.save(offer);

        this.logger.log(`Created offer ${JSON.stringify(savedEntity)}`);

        return this.getOffer(savedEntity.id, {
            relations: ['request', 'store', 'images', 'owner'],
        });
    }

    async getOffers(
        pageOptionsDto: OffersPageOptionsDto,
    ): Promise<OffersPageDto> {
        this.logger.debug(JSON.stringify(pageOptionsDto));
        let queryBuilder = this.offerRepository
            .createQueryBuilder('offer')
            .leftJoinAndSelect('offer.images', 'images')
            .leftJoinAndSelect('offer.store', 'store')
            .leftJoinAndSelect('offer.request', 'request')
            .leftJoinAndSelect('offer.owner', 'owner')
            .leftJoinAndSelect('owner.profile', 'profile');

        if (pageOptionsDto.q) {
            queryBuilder = queryBuilder.searchByString(
                pageOptionsDto.q,
                ['title', 'description', 'reference'],
                true,
            );
        }

        const { items, pageMetaDto } = await queryBuilder.paginate(
            pageOptionsDto,
        );

        return items.toPageDto(pageMetaDto);
    }

    async getOffer(
        id: string,
        options?: FindOneOptions<OfferEntity>,
    ): Promise<OfferDto> {
        const offerEntity = await this.findOne({ id }, options);

        if (!offerEntity) {
            throw new OfferNotFoundException();
        }

        return offerEntity.toDto();
    }

    async updateOffer(id: string, offerDto: UpdateOfferDto) {
        const offerEntity = await this.findOne({ id });
        if (!offerEntity) {
            throw new OfferNotFoundException();
        }

        const {
            store,
            request,
            images,
            owner,
        } = await this.validateOfferInputs(offerDto);

        const offer = await this.save({
            id: offerEntity.id,
            ...offerDto,
            store,
            request,
            images,
            owner,
        });

        let updatedOffer = offerEntity.toDto();
        updatedOffer = { ...updatedOffer, ...offer };

        return updatedOffer;
    }

    async deleteOffer(id: string) {
        const offerEntity = await this.findOne({ id });
        if (!offerEntity) {
            throw new OfferNotFoundException();
        }
        await this.save({
            id: offerEntity.id,
            status: OfferStatus.DELETED,
        });
        offerEntity.status = OfferStatus.DELETED;
        return offerEntity.toDto();
    }

    private async validateOfferInputs(offerDto: Partial<CreateOfferDto>) {
        let store: StoreDto;
        let request: RequestDto;
        let imagesDto: CreateImageDto[];
        let owner: UserDto;
        const { storeID, requestID, images, ownerID } = offerDto;
        if (storeID) {
            store = await this.storeService.getStore(storeID);
        }
        if (requestID) {
            request = await this.requestService.getRequest(requestID);
        }
        if (ownerID) {
            owner = await this.userService.getUser(ownerID);
        }
        if (images) {
            imagesDto = images.map((item) => ({
                ...item,
                folder: ImageFolder.REQUEST,
            }));
        }

        return {
            request,
            store,
            owner,
            images: imagesDto,
        };
    }
}
