import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CountryEntity } from './country.entity';

@EntityRepository(CountryEntity)
export class CountryRepository extends Repository<CountryEntity> {}
