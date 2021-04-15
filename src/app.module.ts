import './boilerplate.polyfill';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import path from 'path';

import { contextMiddleware } from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { CityModule } from './modules/city/city.module';
import { CountryModule } from './modules/country/country.module';
import { DistrictModule } from './modules/district/district.module';
import { ImageModule } from './modules/image/image.module';
import { LocationModule } from './modules/location/location.module';
import { OTPModule } from './modules/otp/otp.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SMSModule } from './modules/sms/sms.module';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ProfileModule,
        CountryModule,
        CityModule,
        DistrictModule,
        LocationModule,
        ImageModule,
        SMSModule,
        OTPModule,
        GraphQLModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.graphQLConfig,
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        I18nModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                fallbackLanguage: configService.fallbackLanguage,
                parserOptions: {
                    path: path.join(__dirname, '/i18n/'),
                    watch: configService.isDevelopment,
                },
            }),
            imports: [SharedModule],
            parser: I18nJsonParser,
            inject: [ConfigService],
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
