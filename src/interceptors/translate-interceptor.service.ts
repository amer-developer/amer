import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { ContextService } from '../providers/context.service';

@Injectable()
export class TranslateInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        let req: any;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        switch (context.getType() as string) {
            case 'http':
                req = context.switchToHttp().getRequest();
                break;
            case 'graphql':
                [, , { req }] = context.getArgs();
                if (!req) {
                    // eslint-disable-next-line @typescript-eslint/tslint/config
                    return undefined;
                }
                break;
            default:
                // eslint-disable-next-line @typescript-eslint/tslint/config
                return undefined;
        }

        const lang = req.raw
            ? req.raw.headers['accept-language']
            : req.headers['accept-language'];
        ContextService.setLanguage(lang);

        return next.handle();
    }
}
