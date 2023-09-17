/* eslint-disable no-console */
import 'module-alias/register';
import 'express-async-errors';
import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import logger from '@tablerise/dynamic-logger';
import autoSwagger from '@tablerise/auto-swagger';
import SwaggerDocumentDnD5E from '../api-docs/swagger-doc-dungeons&dragons5e.json';
import SwaggerDocumentUser from '../api-docs/swagger-doc-user.json';

import RoutesWrapper from 'src/routes/RoutesWrapper';
import DungeonsAndDragonsRouteMiddleware from 'src/routes/middlewares/DungeonsAndDragonsRouteMiddleware';
import UserRouteMiddleware from 'src/routes/middlewares/UserRouteMiddleware';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';

const COOKIE_AGE = 1000 * 60 * 60 * 120;

const app: Application = express();

app.use(express.json())
    .use(
        session({
            secret: 'cats',
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: COOKIE_AGE },
        })
    )
    .use(passport.session())
    .use(cors())
    .use(helmet())
    .use('/health', (req, res) => res.send('OK!'))
    .use(DungeonsAndDragonsRouteMiddleware)
    .use(UserRouteMiddleware)
    .use(ErrorMiddleware);

if (process.env.NODE_ENV === 'develop') {
    autoSwagger(RoutesWrapper.declareRoutes()['dungeons&dragons5e'], { title: 'dungeons&dragons5e' })
        .then((_result: any) => {
            logger('info', 'Swagger - dungeons&dragons5e - document generated');
        })
        .catch((error: any) => {
            console.log(error);
        });

    autoSwagger(RoutesWrapper.declareRoutes().user, { title: 'user' })
        .then((_result: any) => {
            logger('info', 'Swagger - user - document generated');
        })
        .catch((error: any) => {
            console.log(error);
        });
}

app.use('/api-docs/dnd5e', swaggerUI.serve, (req: Request, res: Response) => {
    const html = swaggerUI.generateHTML(SwaggerDocumentDnD5E);
    res.send(html);
});
app.use('/api-docs/user', swaggerUI.serve, (req: Request, res: Response) => {
    const html = swaggerUI.generateHTML(SwaggerDocumentUser);
    res.send(html);
});

logger('info', 'App started');

export default app;
