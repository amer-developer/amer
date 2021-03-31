import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { VirtualColumn } from '../../decorators/virtual-column.decorator';
import { ProfileEntity } from '../profile/profile.entity';
import { UserDto } from './dto/UserDto';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    role: RoleType;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ unique: true, nullable: false })
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @VirtualColumn()
    fullName: string;

    @OneToOne(() => ProfileEntity, (profile) => profile.user)
    @JoinColumn()
    profile: ProfileEntity;

    dtoClass = UserDto;
}
