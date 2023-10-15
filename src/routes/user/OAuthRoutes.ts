import 'src/services/authentication/DiscordStrategy';
import 'src/services/authentication/GoogleStrategy';
import 'src/services/authentication/FacebookStrategy';

import { Router } from 'express';
import passport from 'passport';
import logger from '@tablerise/dynamic-logger';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';

import OAuthControllers from 'src/controllers/user/OAuthControllers';
import OAuthServices from 'src/services/user/OAuthServices';
import AuthErrorMiddleware from 'src/middlewares/AuthErrorMiddleware';
import DatabaseManagement from '@tablerise/database-management';

const database = new DatabaseManagement();

const modelUser = database.modelInstance('user', 'Users');
const modelUserDetails = database.modelInstance('user', 'UserDetails');
const services = new OAuthServices(modelUser, modelUserDetails, logger);
const controllers = new OAuthControllers(services, logger);

const router = Router();
const BASE_PATH = '/oauth';

export const routes = [
    {
        method: 'get',
        path: `${BASE_PATH}/google`,
        options: {
            middlewares: [passport.authenticate('google')],
            authentication: false,
            tag: 'auth',
        },
    },
    {
        method: 'get',
        path: `${BASE_PATH}/google/callback`,
        options: {
            middlewares: [passport.authenticate('google', {
                successRedirect: '/auth/google/register',
                failureRedirect: '/auth/error',
            })],
            authentication: false,
            tag: 'auth',
        },
        hide: true
    },
    {
        method: 'get',
        path: `${BASE_PATH}/google/register`,
        controller: controllers.google,
        options: {
            authentication: false,
            tag: 'auth',
        },
        hide: true
    },
    {
        method: 'get',
        path: `${BASE_PATH}/facebook`,
        options: {
            middlewares: [passport.authenticate('facebook')],
            authentication: false,
            tag: 'auth',
        },
    },
    {
        method: 'get',
        path: `${BASE_PATH}/facebook/callback`,
        options: {
            middlewares: [passport.authenticate('facebook', {
                successRedirect: '/auth/facebook/register',
                failureRedirect: '/auth/error',
            })],
            authentication: false,
            tag: 'auth',
        },
        hide: true
    },
    {
        method: 'get',
        path: `${BASE_PATH}/facebook/register`,
        controller: controllers.facebook,
        options: {
            authentication: false,
            tag: 'auth',
        },
        hide: true
    },
    {
        method: 'get',
        path: `${BASE_PATH}/discord`,
        options: {
            middlewares: [passport.authenticate('discord')],
            authentication: false,
            tag: 'auth',
        },
    },
    {
        method: 'get',
        path: `${BASE_PATH}/discord/callback`,
        options: {
            middlewares: [passport.authenticate('discord', {
                successRedirect: '/auth/discord/register',
                failureRedirect: '/auth/error',
            })],
            authentication: false,
            tag: 'auth',
        },
        hide: true
    },
    {
        method: 'get',
        path: `${BASE_PATH}/discord/register`,
        controller: controllers.discord,
        options: {
            authentication: false,
            tag: 'auth',
        },
        hide: true
    },
    {
        method: 'get',
        path: `${BASE_PATH}/error`,
        options: {
            middlewares: [AuthErrorMiddleware],
            authentication: false,
            tag: 'auth',
        },
        hide: true
    }
] as routeInstance[];

export default {
    routerExpress: buildRouter(routes, router),
    routesSwagger: routes
}
