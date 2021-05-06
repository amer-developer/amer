import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RequestStatus } from '../../common/constants/request-status';
import { CategoryEntity } from '../category/category.entity';
import { ImageEntity } from '../image/image.entity';
import { LocationEntity } from '../location/location.entity';
import { SubCategoryEntity } from '../sub-category/sub-category.entity';
import { UserEntity } from '../user/user.entity';
import { RequestDto } from './dto/request.dto';

@Entity({ name: 'requests' })
export class RequestEntity extends AbstractEntity<RequestDto> {
    @Column({
        nullable: false,
        default: 'nextval(`request_number_sequence`)',
    })
    requestNumber: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { nullable: true })
    budgetMin: number;

    @Column('decimal', { nullable: true })
    budgetMax: number;

    @Column({ nullable: false, default: 'SAR', length: 3 })
    budgetCurrency: string;

    @OneToMany(() => ImageEntity, (image) => image.request, { cascade: true })
    images: ImageEntity[];

    @Column({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.ACTIVE,
    })
    status: RequestStatus;

    @ManyToOne(() => CategoryEntity)
    category: CategoryEntity;

    @ManyToOne(() => SubCategoryEntity)
    subCategory: SubCategoryEntity;

    @OneToOne(() => LocationEntity, (location) => location.request, {
        cascade: true,
    })
    @JoinColumn()
    location: LocationEntity;

    @ManyToOne(() => UserEntity, (user) => user.requests)
    owner: UserEntity;

    dtoClass = RequestDto;
}
