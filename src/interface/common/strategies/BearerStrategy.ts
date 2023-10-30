/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import logger from '@tablerise/dynamic-logger';
import passport from 'passport';
import Bearer from 'passport-http-bearer';

import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import JWTGenerator from 'src/infra/helpers/user/JWTGenerator';
import getErrorName from 'src/infra/helpers/common/getErrorName';

const BearerStrategy = Bearer.Strategy;

passport.use(
    new BearerStrategy((token, done) => {
        logger('warn', 'Request made to authorize operation in server');

        const payload = JWTGenerator.verify(token);

        if (!payload)
            return done(
                new HttpRequestErrors({
                    message: 'Invalid token',
                    code: HttpStatusCode.UNAUTHORIZED,
                    name: getErrorName(HttpStatusCode.UNAUTHORIZED),
                })
            );

        logger('warn', 'Operation authorized');
        done(null, payload);
    })
);
