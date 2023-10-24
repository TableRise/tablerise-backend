/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import passport from 'passport';
import Local from 'passport-local';
import { ZodError, ZodIssue } from 'zod';

import { userLoginZodSchema } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import JWTGenerator from 'src/infra/helpers/user/JWTGenerator';
import SchemaValidator from 'src/infra/helpers/common/SchemaValidator';
import getErrorName from 'src/infra/helpers/common/getErrorName';
import logger from '@tablerise/dynamic-logger';
import { container } from 'src/container';
import SecurePasswordHandler from 'src/infra/helpers/user/SecurePasswordHandler';

const LocalStrategy = Local.Strategy;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            session: false,
        },
        async (email, password, done) => {
            logger('warn', 'LocalStrategy used to login the user');

            const isDataInvalid = new SchemaValidator().entryReturn(userLoginZodSchema, {
                email,
                password,
            }) as ZodError;

            if (isDataInvalid)
                return done(
                    new HttpRequestErrors({
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

            const user = await container.resolve('usersRepository').find({ email });

            if (!user.length)
                return done(
                    new HttpRequestErrors({
                        message: 'Incorrect email or password. Try again.',
                        code: HttpStatusCode.NOT_FOUND,
                        name: getErrorName(HttpStatusCode.NOT_FOUND),
                    })
                );

            const isPasswordValid = await SecurePasswordHandler.comparePassword(password, user[0].password);

            if (!isPasswordValid)
                return done(
                    new HttpRequestErrors({
                        message: 'Incorrect email or password. Try again.',
                        code: HttpStatusCode.UNAUTHORIZED,
                        name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                    })
                );

            if (user[0].inProgress.status !== 'done')
                return done(
                    new HttpRequestErrors({
                        message: 'User status is invalid to perform this operation',
                        code: HttpStatusCode.BAD_REQUEST,
                        name: getErrorName(HttpStatusCode.BAD_REQUEST),
                    })
                );

            const token = JWTGenerator.generate(user[0]);

            done(null, token);
        }
    )
);
