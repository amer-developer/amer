import { Column, Entity, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserEntity } from '../user/user.entity';
import { ProfileDto } from './dto/ProfileDto';

@Entity({ name: 'profiles' })
export class ProfileEntity extends AbstractEntity<ProfileDto> {
    @OneToOne(() => UserEntity, (user) => user.profile) // specify inverse side as a second parameter
    user: UserEntity;

    @Column({ nullable: true })
    bio: string;

    dtoClass = ProfileDto;
}
