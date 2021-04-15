import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CreateOTPDto } from './dto/create-otp.dto';
import { OTPPageOptionsDto } from './dto/otp-page-options.dto';
import { OTPPageDto } from './dto/otp-page.dto';
import { OTPSentRo } from './dto/otp-send.ro';
import { OTPDto } from './dto/otp.dto';
import { UpdateOTPInput } from './dto/update-otp.dto';
import { ValidateOTPDto } from './dto/validate-otp.dto';
import { OTPService } from './otp.service';

@Resolver(() => OTPDto)
export class OTPResolver {
    private logger = new Logger(OTPResolver.name);

    constructor(private otpService: OTPService) {}

    @Mutation(() => OTPSentRo, { name: 'sendOTP' })
    @Auth(RoleType.ADMIN)
    sendOTP(
        @Args()
        otp: CreateOTPDto,
    ): Promise<OTPSentRo> {
        this.logger.debug(`Creating a new ot, otp ${JSON.stringify(otp)}`);
        return this.otpService.sendOTP(otp);
    }

    @Mutation(() => OTPSentRo, { name: 'validateOTP' })
    validateOTP(
        @Args()
        otp: ValidateOTPDto,
    ): Promise<OTPSentRo> {
        this.logger.debug(`Validating an otp, otp ${JSON.stringify(otp)}`);
        return this.otpService.validateOTP(otp);
    }
    @Query(() => OTPPageDto, { name: 'otpList' })
    @Auth(RoleType.ADMIN)
    getOTPList(
        @Args()
        pageOptionsDto: OTPPageOptionsDto,
    ): Promise<OTPPageDto> {
        return this.otpService.getOTPList(pageOptionsDto);
    }

    @Query(() => OTPDto, { name: 'otp' })
    @Auth(RoleType.ADMIN)
    getOTP(@Args('id', new ParseUUIDPipe()) id: string): Promise<OTPDto> {
        return this.otpService.getOTP(id);
    }

    @Mutation(() => OTPDto, { name: 'updateOTP' })
    @Auth(RoleType.ADMIN)
    updateOTP(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() otp: UpdateOTPInput,
        @AuthUser() user: UserEntity,
    ): Promise<OTPDto> {
        this.logger.debug(
            `Update otp, user: ${user.id}, otp ${JSON.stringify(otp)}`,
        );

        return this.otpService.updateOTP(id, otp);
    }

    @Mutation(() => OTPDto, { name: 'deleteOTP' })
    @Auth(RoleType.ADMIN)
    deleteOTP(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<OTPDto> {
        this.logger.debug(`Delete otp, user: ${user.id}, otp: ${id}`);

        return this.otpService.deleteOTP(id);
    }
}
