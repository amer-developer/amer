import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { OTPEntity } from './otp.entity';

@EntityRepository(OTPEntity)
export class OTPRepository extends Repository<OTPEntity> {}
