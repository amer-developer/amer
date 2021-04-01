import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CityEntity } from './city.entity';

@EntityRepository(CityEntity)
export class CityRepository extends Repository<CityEntity> {}
