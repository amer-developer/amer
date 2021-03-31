import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProfileRepository])],
    controllers: [ProfileController],
    exports: [ProfileService],
    providers: [ProfileService, ProfileResolver],
})
export class ProfileModule {}
