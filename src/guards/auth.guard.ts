import { ExecutionContext } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

import { UtilsService } from '../providers/utils.service';

// This should be used as guard class
// eslint-disable-next-line @typescript-eslint/naming-convention
export class AuthGuard extends NestAuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        return UtilsService.getRequest(context);
    }
}
