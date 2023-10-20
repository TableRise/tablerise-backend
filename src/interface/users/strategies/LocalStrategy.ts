/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import passport from 'passport';
import Local from 'passport-local';
import { ZodError, ZodIssue } from 'zod';

import { userLoginZodSchema } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/HttpStatusCode';
import JWTGenerator from 'src/infra/helpers/JWTGenerator';
import SchemaValidator from 'src/infra/helpers/SchemaValidator';
import getErrorName from 'src/infra/helpers/getErrorName';
import logger from '@tablerise/dynamic-logger';
import { container } from 'src/container';

const LocalStrategy = Local.Strategy;
const { UsersModel, httpRequestErrors, securePasswordHandler } = container;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            session: false,
        },
        async (email, password, done) => {
            logger('warn', ' Request made to login');

            const isDataInvalid = new SchemaValidator().entryReturn(userLoginZodSchema, {
                email,
                password,
            }) as ZodError;

            if (isDataInvalid)
                return done(
                    httpRequestErrors({
                        message: 'Schema error',
                        code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                        name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                        // @ts-expect-error Error will exist with sure
                        details: isDataInvalid.error.issues.map((err: ZodIssue) => ({
                            attribute: err.path.length > 1 ? err.path : err.path[0],
                            reason: err.message,
                            path: 'payload',
                        })),
                    })
                );

            const user = await UsersModel.findAll({ email });

            if (!user.length)
                return done(
                    new HttpRequestErrors({
                        message: 'Incorrect email or password. Try again.',
                        code: HttpStatusCode.NOT_FOUND,
                        name: getErrorName(HttpStatusCode.NOT_FOUND),
                    })
                );

            const isPasswordValid = await securePasswordHandler.comparePassword(password, user[0].password);

            if (!isPasswordValid)
                return done(
                    httpRequestErrors({
                        message: 'Incorrect email or password. Try again.',
                        code: HttpStatusCode.UNAUTHORIZED,
                        name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                    })
                );

            if (user[0].inProgress?.status !== 'done') httpRequestErrors.throwError('invalid-user-status');

            const token = JWTGenerator.generate(user[0]);

            done(null, token);
        }
    )
);
