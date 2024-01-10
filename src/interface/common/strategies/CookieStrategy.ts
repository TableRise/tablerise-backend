/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import logger from '@tablerise/dynamic-logger';
import passport, { DoneCallback } from 'passport';
import CookieStrategy from 'passport-cookie';

import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { container } from 'src/container';
import { request } from 'express';

passport.use(
    new CookieStrategy(async (token: string, done: DoneCallback) => {
        logger('warn', 'Request made to authorize operation in server');
        const tokenForbidden = container.resolve('tokenForbidden');
        const isTokenLoggedOut = await tokenForbidden.verifyForbiddenToken(token);

        if (isTokenLoggedOut)
            return done(
                new HttpRequestErrors({
                    message: 'Token logged out!',
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                })
            );

        const payload = JWTGenerator.verify(token);

        if (!payload)
            return done(
                new HttpRequestErrors({
                    message: 'Invalid token!',
                    code: HttpStatusCode.UNAUTHORIZED,
                    name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                })
            );

        logger('warn', 'Operation authorized');

        request.token = token;
        done(null, payload);
    })
);
