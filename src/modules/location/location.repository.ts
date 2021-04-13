import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { LocationEntity } from './location.entity';

@EntityRepository(LocationEntity)
export class LocationRepository extends Repository<LocationEntity> {}
