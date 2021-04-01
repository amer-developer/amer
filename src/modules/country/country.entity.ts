import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CityEntity } from '../city/city.entity';
import { CountryDto } from './dto/country.dto';

@Entity({ name: 'countries' })
export class CountryEntity extends AbstractEntity<CountryDto> {
    @Column({ nullable: false })
    code: string;

    @Column({ nullable: false })
    nameAR: string;

    @Column({ nullable: false })
    nameEN: string;

    @OneToMany(() => CityEntity, (city) => city.country)
    cities: CityEntity[];

    dtoClass = CountryDto;
}
