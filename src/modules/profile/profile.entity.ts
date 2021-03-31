import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserEntity } from '../user/user.entity';
import { ProfileDto } from './dto/profile.dto';

@Entity({ name: 'profiles' })
export class ProfileEntity extends AbstractEntity<ProfileDto> {
    @OneToOne(() => UserEntity, (user) => user.profile)
    user: UserEntity;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    avatar: string;

    dtoClass = ProfileDto;
}
