import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { StoreEntity } from './store.entity';

@EntityRepository(StoreEntity)
export class StoreRepository extends Repository<StoreEntity> {}
