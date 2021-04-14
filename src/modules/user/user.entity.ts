import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { UserStatus } from '../../common/constants/user-status';
import { LocationEntity } from '../location/location.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { UserDto } from './dto/user.dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ nullable: false })
    name: string;

    @Column({ type: 'enum', enum: RoleType, default: RoleType.BUYER })
    role: RoleType;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: false })
    phone: string;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
    status: UserStatus;

    @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
    @JoinColumn()
    profile: ProfileEntity;

    @OneToOne(() => LocationEntity, (location) => location.user, {
        cascade: true,
    })
    @JoinColumn()
    location: LocationEntity;

    dtoClass = UserDto;
}
