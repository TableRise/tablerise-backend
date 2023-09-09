import { Router } from 'express';
import passport from 'passport';
import logger from '@tablerise/dynamic-logger';

import OAuthControllers from 'src/controllers/user/OAuthControllers';
import OAuthServices from 'src/services/user/OAuthServices';
import AuthErrorMiddleware from 'src/middlewares/AuthErrorMiddleware';

const services = new OAuthServices(logger);
const controllers = new OAuthControllers(services, logger);

const route = Router();

route.get('/google', passport.authenticate('google'));
route.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/register',
        failureRedirect: '/auth/error',
    })
);
route.get('/google/register', controllers.google);
route.get('/error', AuthErrorMiddleware);

export default route;
