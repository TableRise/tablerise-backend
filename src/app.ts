import 'express-async-errors';
import 'src/services/authentication/BearerStrategy';

import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import logger from '@tablerise/dynamic-logger';

import DungeonsAndDragonsRouteMiddleware from 'src/routes/middlewares/DungeonsAndDragonsRouteMiddleware';
import { container } from './container';
import ErrorMiddleware from 'src/interface/common/middlewares/ErrorMiddleware';
import swaggerGenerator from './support/helpers/swaggerGenerator';

const COOKIE_AGE = 1000 * 60 * 60 * 120;
const { usersRoutesMiddleware } = container;

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
    .use(usersRoutesMiddleware.get())
    .use(DungeonsAndDragonsRouteMiddleware)
    .use(ErrorMiddleware);

logger('info', 'App started');

export default app;
