import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ImageEntity } from './image.entity';

@EntityRepository(ImageEntity)
export class ImageRepository extends Repository<ImageEntity> {}
