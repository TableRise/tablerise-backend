/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import passport from 'passport';
import Local from 'passport-local';
import { ZodError, ZodIssue } from 'zod';

import { User, userLoginZodSchema } from 'src/schemas/user/usersValidationSchema';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import JWTGenerator from 'src/support/helpers/JWTGenerator';
import ValidateData from 'src/support/helpers/ValidateData';
import getErrorName from 'src/support/helpers/getErrorName';
import logger from '@tablerise/dynamic-logger';

const LocalStrategy = Local.Strategy;

const UsersModel = new DatabaseManagement().modelInstance('user', 'Users') as MongoModel<User>;
const verifyMock = (password: string, other: string): any => password === other;

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
                        message: 'User with provided email do not exist in database',
                        code: HttpStatusCode.NOT_FOUND,
                        name: getErrorName(HttpStatusCode.NOT_FOUND),
                    })
                );

            const isPasswordValid = await verifyMock(password, user[0].password);

            if (!isPasswordValid)
                return done(
                    new HttpRequestErrors({
                        message: 'Incorrect password',
                        code: HttpStatusCode.UNAUTHORIZED,
                        name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                    })
                );

            const token = JWTGenerator.generate(user[0]);

            done(null, token);
        }
    )
);
