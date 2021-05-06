import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { isArray, isEmpty, snakeCase } from 'lodash';

import { TranslationService } from '../shared/services/translation.service';

@Catch(UnprocessableEntityException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        public reflector: Reflector,
        public translate: TranslationService,
    ) {}

    async catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode = exception.getStatus();
        const r = exception.getResponse() as any;

        if (isArray(r.message) && r.message[0] instanceof ValidationError) {
            statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            r.error = STATUS_CODES[statusCode];
            const validationErrors = r.message as ValidationError[];
            const errors = await this.validationFilter(validationErrors);
            r.errors = errors ?? validationErrors;
            delete r.message;
        }

        r.statusCode = statusCode;
        r.error = STATUS_CODES[statusCode];

        if (host.getType() === 'http') {
            response.status(statusCode).json(r);
        } else {
            throw new HttpException(r, HttpStatus.BAD_REQUEST);
        }
    }

    private async validationFilter(validationErrors: ValidationError[]) {
        const errors = [];
        for (const validationError of validationErrors) {
            const error: any = {};
            if (!isEmpty(validationError.children)) {
                error.choldren = this.validationFilter(
                    validationError.children,
                );
                return;
            }
            error.field = validationError.property;

            error.constraints = [];
            for (const [constraintKey, constraint] of Object.entries(
                validationError.constraints,
            )) {
                // convert default messages
                // convert error message to error.fields.{key} syntax for i18n translation
                const key = `validation.${snakeCase(constraintKey)}`;
                const message = await this.translate.translate(key, {
                    args: {
                        property: await this.translate.translate(
                            `fields.${validationError.property}`,
                        ),
                    },
                });

                error.constraints.push({
                    code: constraintKey,
                    message: message === key ? constraint : message,
                });
            }
            errors.push(error);
        }
        return errors;
    }
}
