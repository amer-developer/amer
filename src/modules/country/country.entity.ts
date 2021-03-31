import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CountryDto } from './dto/country.dto';

@Entity({ name: 'countries' })
export class CountryEntity extends AbstractEntity<CountryDto> {
    @Column({ nullable: true })
    code: string;

    @Column({ nullable: true })
    nameAR: string;

    @Column({ nullable: true })
    nameEN: string;

    dtoClass = CountryDto;
}
