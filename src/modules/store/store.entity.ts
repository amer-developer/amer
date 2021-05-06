import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { StoreStatus } from '../../common/constants/store-status';
import { CategoryEntity } from '../category/category.entity';
import { LocationEntity } from '../location/location.entity';
import { SubCategoryEntity } from '../sub-category/sub-category.entity';
import { UserEntity } from '../user/user.entity';
import { StoreDto } from './dto/store.dto';

@Entity({ name: 'stores' })
export class StoreEntity extends AbstractEntity<StoreDto> {
    @Column({
        nullable: false,
        default: 'nextval(`store_number_sequence`)',
    })
    storeNumber: number;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    bio: string;

    @ManyToOne(() => CategoryEntity)
    category: CategoryEntity;

    @ManyToOne(() => SubCategoryEntity)
    subCategory: SubCategoryEntity;

    @OneToOne(() => LocationEntity, (location) => location.store, {
        cascade: true,
    })
    @JoinColumn()
    location: LocationEntity;

    @Column({
        type: 'enum',
        enum: StoreStatus,
        default: StoreStatus.INACTIVE,
    })
    status: StoreStatus;

    @OneToMany(() => UserEntity, (user) => user.store)
    users: UserEntity[];

    dtoClass = StoreDto;
}
