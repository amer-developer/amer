import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ProfileEntity } from './profile.entity';

@EntityRepository(ProfileEntity)
export class ProfileRepository extends Repository<ProfileEntity> {}
