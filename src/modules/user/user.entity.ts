import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { VirtualColumn } from '../../decorators/virtual-column.decorator';
import { UserDto } from './dto/UserDto';

@ObjectType()
@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ nullable: true })
    @Field()
    firstName: string;

    @Column({ nullable: true })
    @Field()
    lastName: string;

    @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
    @Field()
    role: RoleType;

    @Column({ unique: true, nullable: true })
    @Field()
    email: string;

    @Column({ nullable: true })
    @Field()
    password: string;

    @Column({ nullable: true })
    @Field()
    phone: string;

    @Column({ nullable: true })
    @Field()
    avatar: string;

    @VirtualColumn()
    fullName: string;

    dtoClass = UserDto;
}
