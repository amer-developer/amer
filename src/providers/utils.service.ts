import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import bcrypt from 'bcrypt';

export class UtilsService {
    /**
     * convert entity to dto class instance
     * @param {{new(entity: E, options: any): T}} model
     * @param {E[] | E} entity
     * @param options
     * @returns {T[] | T}
     */
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E,
        options?: Record<string, any>,
    ): T;
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E[],
        options?: Record<string, any>,
    ): T[];
    public static toDto<T, E>(
        model: new (entity: E, options?: any) => T,
        entity: E | E[],
        options?: Record<string, any>,
    ): T | T[] {
        if (Array.isArray(entity)) {
            return entity.map((u) => new model(u, options));
        }

        return new model(entity, options);
    }

    /**
     * generate hash from password or string
     * @param {string} password
     * @returns {string}
     */
    static generateHash(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * generate random string
     * @param length
     */
    static generateRandomString(length: number): string {
        return Math.random()
            .toString(36)
            .replace(/[^a-zA-Z0-9]+/g, '')
            .substr(0, length);
    }
    /**
     * validate text with hash
     * @param {string} password
     * @param {string} hash
     * @returns {Promise<boolean>}
     */
    static validateHash(password: string, hash: string): Promise<boolean> {
        if (!password || !hash) {
            return Promise.resolve(false);
        }
        return bcrypt.compare(password, hash);
    }

    static getRequest(context: ExecutionContext) {
        let request: any;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        switch (context.getType() as string) {
            case 'http':
                request = context.switchToHttp().getRequest();
                break;
            case 'graphql':
                request = GqlExecutionContext.create(context).getContext().req;
                break;
            default:
                // eslint-disable-next-line @typescript-eslint/tslint/config
                return undefined;
        }
        return request;
    }
}
