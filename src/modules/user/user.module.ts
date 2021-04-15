import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationModule } from '../location/location.module';
import { OTPModule } from '../otp/otp.module';
import { ProfileModule } from '../profile/profile.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
        ProfileModule,
        LocationModule,
        OTPModule,
    ],
    controllers: [UserController],
    exports: [UserService],
    providers: [UserService, UserResolver],
})
export class UserModule {}
