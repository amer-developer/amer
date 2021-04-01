import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CountryEntity } from '../country/country.entity';
import { CityDto } from './dto/city.dto';

@Entity({ name: 'cities' })
export class CityEntity extends AbstractEntity<CityDto> {
    @Column({ nullable: false })
    nameAR: string;

    @Column({ nullable: false })
    nameEN: string;

    @ManyToOne(() => CountryEntity, (country) => country.cities)
    country: CountryEntity;

    dtoClass = CityDto;
}
