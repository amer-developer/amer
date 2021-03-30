import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserEntity } from '../modules/user/user.entity';
import { ContextService } from '../providers/context.service';
import { UtilsService } from '../providers/utils.service';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = UtilsService.getRequest(context);

        const user = <UserEntity>request.user;
        ContextService.setAuthUser(user);

        return next.handle();
    }
}
