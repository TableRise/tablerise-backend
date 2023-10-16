import 'module-alias/register';
import 'express-async-errors';
import 'dotenv/config';
import 'src/services/authentication/BearerStrategy';

import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import logger from '@tablerise/dynamic-logger';

import DungeonsAndDragonsRouteMiddleware from 'src/routes/middlewares/DungeonsAndDragonsRouteMiddleware';
import UserRouteMiddleware from 'src/routes/middlewares/UserRouteMiddleware';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';
import swaggerGenerator from './support/helpers/swaggerGenerator';

const COOKIE_AGE = 1000 * 60 * 60 * 120;

const app: Application = express();
const swaggerDocs = swaggerGenerator(process.env.NODE_ENV as string);

app.use(express.json())
    .use(
        session({
            secret: (process.env.COOKIE_SECRET as string) || 'catfish',
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: COOKIE_AGE },
        })
    )
    .use(passport.session())
    .use(cors())
    .use(helmet())
    .use('/health', (req, res) => res.send('OK!'))
    .use(swaggerDocs)
    .use(UserRouteMiddleware)
    .use(DungeonsAndDragonsRouteMiddleware)
    .use(ErrorMiddleware);

logger('info', 'App started');

export default app;
