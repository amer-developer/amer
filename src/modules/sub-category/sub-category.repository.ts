import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SubCategoryEntity } from './sub-category.entity';

@EntityRepository(SubCategoryEntity)
export class SubCategoryRepository extends Repository<SubCategoryEntity> {}
