import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

// This should be used as guard class
// eslint-disable-next-line @typescript-eslint/naming-convention
export class AuthGuard extends NestAuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        let ctx: any;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        switch (context.getType() as string) {
            case 'http':
                ctx = context.switchToHttp().getRequest();
                break;
            case 'graphql':
                ctx = GqlExecutionContext.create(context);
                break;
            default:
                // eslint-disable-next-line @typescript-eslint/tslint/config
                return undefined;
        }
        return ctx.getContext().req;
    }
}
