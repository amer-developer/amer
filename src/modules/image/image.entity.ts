import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ImageFolder } from '../../common/constants/image-folder';
import { RequestEntity } from '../request/request.entity';
import { ImageDto } from './dto/image.dto';

@Entity({ name: 'images' })
export class ImageEntity extends AbstractEntity<ImageDto> {
    @Column({ nullable: true })
    name: string;

    @Column({ type: 'enum', enum: ImageFolder, nullable: true })
    folder: ImageFolder;

    @Column({ nullable: false })
    url: string;

    @ManyToOne(() => RequestEntity, (request) => request.images)
    request: RequestEntity;

    dtoClass = ImageDto;
}
