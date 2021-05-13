import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { OfferStatus } from '../../common/constants/offer-status';
import { ImageEntity } from '../image/image.entity';
import { RequestEntity } from '../request/request.entity';
import { StoreEntity } from '../store/store.entity';
import { UserEntity } from '../user/user.entity';
import { OfferDto } from './dto/offer.dto';

@Entity({ name: 'offers' })
export class OfferEntity extends AbstractEntity<OfferDto> {
    @Column({
        nullable: false,
    })
    reference: number;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: false })
    description: string;

    @Column('decimal', { nullable: true })
    price: number;

    @Column({ nullable: false, default: 'SAR', length: 3 })
    priceCurrency: string;

    @OneToMany(() => ImageEntity, (image) => image.offer, { cascade: true })
    images: ImageEntity[];

    @Column({
        type: 'enum',
        enum: OfferStatus,
        default: OfferStatus.ACTIVE,
    })
    status: OfferStatus;

    @ManyToOne(() => RequestEntity, (request) => request.offers)
    request: RequestEntity;

    @ManyToOne(() => UserEntity, (user) => user.offers)
    owner: UserEntity;

    @ManyToOne(() => StoreEntity, (store) => store.offers)
    store: StoreEntity;

    dtoClass = OfferDto;
}
