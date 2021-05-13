import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { OfferEntity } from './offer.entity';

@EntityRepository(OfferEntity)
export class OfferRepository extends Repository<OfferEntity> {}
