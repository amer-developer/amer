import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CreateOtpDto } from './dto/create-otp.dto';
import { OtpPageOptionsDto } from './dto/otp-page-options.dto';
import { OtpPageDto } from './dto/otp-page.dto';
import { OtpSentRo } from './dto/otp-send.ro';
import { OtpDto } from './dto/otp.dto';
import { UpdateOtpInput } from './dto/update-otp.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { OtpService } from './otp.service';

@Resolver(() => OtpDto)
export class OtpResolver {
    private logger = new Logger(OtpResolver.name);

    constructor(private otpService: OtpService) {}

    @Mutation(() => OtpSentRo, { name: 'sendOtp' })
    async sendOtp(
        @Args()
        otp: CreateOtpDto,
    ): Promise<OtpSentRo> {
        this.logger.debug(`Creating a new ot, otp ${JSON.stringify(otp)}`);
        return this.otpService.sendOtp(otp);
    }

    @Mutation(() => OtpSentRo, { name: 'validateOtp' })
    async validateOtp(
        @Args()
        otp: ValidateOtpDto,
    ): Promise<OtpSentRo> {
        this.logger.debug(`Validating an otp, otp ${JSON.stringify(otp)}`);
        return this.otpService.validateOTP(otp);
    }
    @Query(() => OtpPageDto, { name: 'otps' })
    getOtpList(
        @Args()
        pageOptionsDto: OtpPageOptionsDto,
    ): Promise<OtpPageDto> {
        return this.otpService.getOtpList(pageOptionsDto);
    }

    @Query(() => OtpDto, { name: 'otp' })
    getOtp(@Args('id', new ParseUUIDPipe()) id: string): Promise<OtpDto> {
        return this.otpService.getOtp(id);
    }

    @Mutation(() => OtpDto, { name: 'updateOtp' })
    @Auth(RoleType.ADMIN)
    updateOtp(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() otp: UpdateOtpInput,
        @AuthUser() user: UserEntity,
    ): Promise<OtpDto> {
        this.logger.debug(
            `Update otp, user: ${user.id}, otp ${JSON.stringify(otp)}`,
        );

        return this.otpService.updateOtp(id, otp);
    }

    @Mutation(() => OtpDto, { name: 'deleteOtp' })
    @Auth(RoleType.ADMIN)
    deleteOtp(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<OtpDto> {
        this.logger.debug(`Delete otp, user: ${user.id}, otp: ${id}`);

        return this.otpService.deleteOtp(id);
    }
}
