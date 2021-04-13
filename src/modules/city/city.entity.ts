import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CountryEntity } from '../country/country.entity';
import { DistrictEntity } from '../district/district.entity';
import { LocationEntity } from '../location/location.entity';
import { CityDto } from './dto/city.dto';

@Entity({ name: 'cities' })
export class CityEntity extends AbstractEntity<CityDto> {
    @Column({ nullable: false })
    nameAR: string;

    @Column({ nullable: false })
    nameEN: string;

    @ManyToOne(() => CountryEntity, (country) => country.cities)
    country: CountryEntity;

    @OneToMany(() => DistrictEntity, (district) => district.city)
    districts: DistrictEntity[];

    @OneToMany(() => LocationEntity, (location) => location.city)
    locations: LocationEntity[];

    dtoClass = CityDto;
}
