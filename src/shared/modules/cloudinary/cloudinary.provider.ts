import { v2 } from 'cloudinary';

import { ConfigService } from '../../services/config.service';
import { CLOUDINARY } from './constants';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: (configService: ConfigService): void =>
        v2.config({
            cloud_name: configService.get('CLD_CLOUD_NAME'),
            api_key: configService.get('CLD_API_KEY'),
            api_secret: configService.get('CLD_API_SECRET'),
        }),
    inject: [ConfigService],
};
