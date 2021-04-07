import {
    ClassSerializerInterceptor,
    HttpStatus,
    UnprocessableEntityException,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
    ExpressAdapter,
    NestExpressApplication,
} from '@nestjs/platform-express';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { TranslateInterceptor } from './interceptors/translate-interceptor.service';
import { setupSwagger } from './setup-swagger';
import { ConfigService } from './shared/services/config.service';
import { TranslationService } from './shared/services/translation.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        { cors: true },
    );
    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(
        helmet({
            contentSecurityPolicy:
                process.env.NODE_ENV === 'production' ? undefined : false,
        }),
    );

    app.use(
        RateLimit({
            windowMs: 1 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use(compression());
    app.use(morgan('combined'));

    const reflector = app.get(Reflector);

    const translationService = app.select(SharedModule).get(TranslationService);

    app.useGlobalFilters(
        new HttpExceptionFilter(reflector, translationService),
        new QueryFailedFilter(reflector),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(reflector),
        new TranslateInterceptor(),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            transform: true,
            dismissDefaultMessages: false,
            exceptionFactory: (errors) =>
                new UnprocessableEntityException(errors),
        }),
    );

    const configService = app.select(SharedModule).get(ConfigService);

    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            port: configService.getNumber('TRANSPORT_PORT'),
            retryAttempts: 5,
            retryDelay: 3000,
        },
    });

    await app.startAllMicroservicesAsync();

    if (['development', 'staging'].includes(configService.nodeEnv)) {
        setupSwagger(app);
    }

    const port = configService.getNumber('PORT');
    await app.listen(port);

    console.info(`server running on port ${port}`);
}

void bootstrap();
