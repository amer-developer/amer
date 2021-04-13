import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { DistrictEntity } from './district.entity';

@EntityRepository(DistrictEntity)
export class DistrictRepository extends Repository<DistrictEntity> {}
