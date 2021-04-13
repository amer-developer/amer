import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CityEntity } from '../city/city.entity';
import { LocationEntity } from '../location/location.entity';
import { DistrictDto } from './dto/district.dto';

@Entity({ name: 'districts' })
export class DistrictEntity extends AbstractEntity<DistrictDto> {
    @Column({ nullable: false })
    nameAR: string;

    @Column({ nullable: false })
    nameEN: string;

    @ManyToOne(() => CityEntity, (city) => city.districts)
    city: CityEntity;

    @OneToMany(() => LocationEntity, (location) => location.district)
    locations: LocationEntity[];

    dtoClass = DistrictDto;
}
