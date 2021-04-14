import { HttpService, Injectable, Logger } from '@nestjs/common';

import { ConfigService } from './config.service';

@Injectable()
export class SMSService {
    private logger = new Logger(SMSService.name);

    private baseURL: string;
    private apiKey: string;
    private username: string;
    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) {
        this.baseURL = this.configService.get('MSEGAT_BASE_URL');
        this.apiKey = this.configService.get('MSEGAT_API_KEY');
        this.username = this.configService.get('MSEGAT_USERNAME');
    }

    async sendSMS(numbers: string, body: string) {
        let isSuccess = false;
        const payload = {
            numbers,
            userName: this.username,
            apiKey: this.apiKey,
            userSender: 'OTP',
            msg: body,
        };
        this.logger.log(`Sending SMS. Request: ${JSON.stringify(payload)}`);
        if (this.configService.get('SMS_ENABLED') === 'false') {
            return true;
        }
        try {
            const smsResponse = await this.httpService
                .post(this.baseURL + '/gw/sendsms.php', payload)
                .toPromise();
            this.logger.log(
                `Sending SMS. Response: ${JSON.stringify(smsResponse.data)}`,
            );
            isSuccess =
                smsResponse.data &&
                (smsResponse.data.code === '1' ||
                    smsResponse.data.code === 'M0000');
        } catch (error) {
            this.logger.error(error);
        }

        return isSuccess;
    }
}
