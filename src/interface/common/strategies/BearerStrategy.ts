/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import logger from '@tablerise/dynamic-logger';
import passport from 'passport';
import Bearer from 'passport-http-bearer';

import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import JWTGenerator from 'src/domains/user/helpers/JWTGenerator';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { container } from 'src/container';
import { request } from 'express';

const BearerStrategy = Bearer.Strategy;

passport.use(
    new BearerStrategy(async (token, done) => {
        logger('warn', 'Request made to authorize operation in server');
        const tokenForbidden = container.resolve('tokenForbidden');
        const isTokenLoggedOut = tokenForbidden.verifyForbiddenToken(token);

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
