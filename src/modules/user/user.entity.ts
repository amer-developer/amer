import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { ProfileEntity } from '../profile/profile.entity';
import { UserDto } from './dto/user.dto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ nullable: false })
    name: string;

    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ unique: true, nullable: false })
    phone: string;

    @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
    @JoinColumn()
    profile: ProfileEntity;

    dtoClass = UserDto;
}
