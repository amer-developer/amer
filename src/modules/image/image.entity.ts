import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ImageDto } from './dto/image.dto';

@Entity({ name: 'images' })
export class ImageEntity extends AbstractEntity<ImageDto> {
    @Column({ nullable: false })
    name: string;

    dtoClass = ImageDto;
}
