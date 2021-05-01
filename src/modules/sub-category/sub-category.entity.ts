import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { SubCategoryStatus } from '../../common/constants/sub-category-status';
import { CategoryEntity } from '../category/category.entity';
import { SubCategoryDto } from './dto/sub-category.dto';

@Entity({ name: 'sub_categories' })
export class SubCategoryEntity extends AbstractEntity<SubCategoryDto> {
    @Column({ nullable: false })
    nameAR: string;

    @Column({ nullable: false })
    nameEN: string;

    @ManyToOne(() => CategoryEntity, (country) => country.subCategories)
    category: CategoryEntity;

    @Column({
        type: 'enum',
        enum: SubCategoryStatus,
        default: SubCategoryStatus.INACTIVE,
    })
    status: SubCategoryStatus;

    dtoClass = SubCategoryDto;
}
