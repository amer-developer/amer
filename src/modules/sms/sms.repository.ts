import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SMSEntity } from './sms.entity';

@EntityRepository(SMSEntity)
export class SMSRepository extends Repository<SMSEntity> {}
