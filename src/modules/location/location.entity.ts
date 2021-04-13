import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CityEntity } from '../city/city.entity';
import { CountryEntity } from '../country/country.entity';
import { DistrictEntity } from '../district/district.entity';
import { UserEntity } from '../user/user.entity';
import { LocationDto } from './dto/location.dto';

@Entity({ name: 'locations' })
export class LocationEntity extends AbstractEntity<LocationDto> {
    @Column({ nullable: true })
    address1: string;

    @Column({ nullable: true })
    address2: string;

    @ManyToOne(() => CityEntity, (city) => city.locations)
    city: CityEntity;

    @ManyToOne(() => CountryEntity, (country) => country.locations)
    country: CountryEntity;

    @ManyToOne(() => DistrictEntity, (district) => district.locations)
    district: DistrictEntity;

    @OneToOne(() => UserEntity, (user) => user.location)
    user: UserEntity;

    dtoClass = LocationDto;
}
