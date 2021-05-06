import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { RequestEntity } from './request.entity';

@EntityRepository(RequestEntity)
export class RequestRepository extends Repository<RequestEntity> {}
