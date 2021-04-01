import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CountryDto } from './dto/country.dto';

@Entity({ name: 'countries' })
export class CountryEntity extends AbstractEntity<CountryDto> {
    @Column({ nullable: false })
    code: string;

    @Column({ nullable: false })
    nameAR: string;

    @Column({ nullable: false })
    nameEN: string;

    dtoClass = CountryDto;
}
