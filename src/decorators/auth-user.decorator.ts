import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UtilsService } from '../providers/utils.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = UtilsService.getRequest(ctx);
        return request.user;
    },
);
