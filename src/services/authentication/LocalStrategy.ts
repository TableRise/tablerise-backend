/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import passport from 'passport';
import Local from 'passport-local';
import { ZodError, ZodIssue } from 'zod';

import { User, userLoginZodSchema } from 'src/schemas/user/usersValidationSchema';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import JWTGenerator from 'src/services/authentication/helpers/JWTGenerator';
import ValidateData from 'src/services/helpers/ValidateData';
import getErrorName from 'src/services/helpers/getErrorName';
import logger from '@tablerise/dynamic-logger';
import { SecurePasswordHandler } from 'src/services/user/helpers/SecurePasswordHandler';

const LocalStrategy = Local.Strategy;

const UsersModel = new DatabaseManagement().modelInstance('user', 'Users') as MongoModel<User>;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            session: false,
        },
        async (email, password, done) => {
            logger('warn', ' Request made to login');

            const isDataInvalid = new ValidateData().entryReturn(userLoginZodSchema, { email, password }) as ZodError;

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

            const user = await UsersModel.findAll({ email });

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

            const token = JWTGenerator.generate(user[0]);

            done(null, token);
        }
    )
);
