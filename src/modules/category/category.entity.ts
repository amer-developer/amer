import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CategoryStatus } from '../../common/constants/category-status';
import { SubCategoryEntity } from '../sub-category/sub-category.entity';
import { CategoryDto } from './dto/category.dto';

@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity<CategoryDto> {
    @Column({ nullable: false })
    nameAR: string;

    @Column({ nullable: false })
    nameEN: string;

    @Column({
        type: 'enum',
        enum: CategoryStatus,
        default: CategoryStatus.INACTIVE,
    })
    status: CategoryStatus;

    @OneToMany(() => SubCategoryEntity, (sub) => sub.category)
    subCategories: SubCategoryEntity[];

    dtoClass = CategoryDto;
}
