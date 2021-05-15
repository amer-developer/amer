import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CategoryStatus } from '../../common/constants/category-status';
import { ImageEntity } from '../image/image.entity';
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

    @OneToOne(() => ImageEntity)
    @JoinColumn()
    icon: ImageEntity;

    @Column({ nullable: true })
    backgroundColor: string;

    @Column({ nullable: true })
    textColor: string;

    dtoClass = CategoryDto;
}
