import { Logger, ParseUUIDPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleType } from '../../common/constants/role-type';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../user/user.entity';
import { CreateSMSDto } from './dto/create-sms.dto';
import { SMSPageOptionsDto } from './dto/sms-page-options.dto';
import { SMSPageDto } from './dto/sms-page.dto';
import { SMSSentRo } from './dto/sms-send.ro';
import { SMSDto } from './dto/sms.dto';
import { UpdateSMSInput } from './dto/update-sms.dto';
import { SMSService } from './sms.service';

@Resolver(() => SMSDto)
export class SMSResolver {
    private logger = new Logger(SMSResolver.name);

    constructor(private smsService: SMSService) {}

    @Mutation(() => SMSSentRo, { name: 'sendSMS' })
    @Auth(RoleType.ADMIN)
    async sendSMS(
        @Args()
        sms: CreateSMSDto,
    ): Promise<SMSSentRo> {
        this.logger.debug(`Creating a new ot, sms ${JSON.stringify(sms)}`);
        return this.smsService.sendSMS(sms);
    }

    @Query(() => SMSPageDto, { name: 'smsList' })
    @Auth(RoleType.ADMIN)
    getSMSList(
        @Args()
        pageOptionsDto: SMSPageOptionsDto,
    ): Promise<SMSPageDto> {
        return this.smsService.getSMSList(pageOptionsDto);
    }

    @Query(() => SMSDto, { name: 'sms' })
    @Auth(RoleType.ADMIN)
    getSMS(@Args('id', new ParseUUIDPipe()) id: string): Promise<SMSDto> {
        return this.smsService.getSMS(id);
    }

    @Mutation(() => SMSDto, { name: 'updateSMS' })
    @Auth(RoleType.ADMIN)
    updateSMS(
        @Args('id', new ParseUUIDPipe()) id: string,
        @Args() sms: UpdateSMSInput,
        @AuthUser() user: UserEntity,
    ): Promise<SMSDto> {
        this.logger.debug(
            `Update sms, user: ${user.id}, sms ${JSON.stringify(sms)}`,
        );

        return this.smsService.updateSMS(id, sms);
    }

    @Mutation(() => SMSDto, { name: 'deleteSMS' })
    @Auth(RoleType.ADMIN)
    deleteSMS(
        @Args('id', new ParseUUIDPipe()) id: string,
        @AuthUser() user: UserEntity,
    ): Promise<SMSDto> {
        this.logger.debug(`Delete sms, user: ${user.id}, sms: ${id}`);

        return this.smsService.deleteSMS(id);
    }
}
