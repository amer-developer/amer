import { Global, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { ExternalSMSService } from './services/sms.service';
import { TranslationService } from './services/translation.service';
import { ValidatorService } from './services/validator.service';

const providers = [
    ConfigService,
    ValidatorService,
    GeneratorService,
    TranslationService,
    CloudinaryService,
    ExternalSMSService,
];

@Global()
@Module({
    providers,
    imports: [
        HttpModule,
        CloudinaryModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_KEY'),
                // if you want to use token with expiration date
                // signOptions: {
                //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
                // },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}
