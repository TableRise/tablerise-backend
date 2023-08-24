/* eslint-disable no-console */
import 'module-alias/register';
import 'express-async-errors';
import 'dotenv/config';

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import logger from '@tablerise/dynamic-logger';
import autoSwagger from '@tablerise/auto-swagger';
import SwaggerDocumentDnD5E from '../api-docs/swagger-doc-dungeons&dragons5e.json';

import RoutesWrapper from 'src/routes/RoutesWrapper';
import DungeonsAndDragonsRouteMiddleware from 'src/routes/middlewares/DungeonsAndDragonsRouteMiddleware';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';

const app: Application = express();

app.use(express.json())
    .use(cors())
    .use(helmet())
    .use('/health', (req, res) => res.send('OK!'))
    .use(DungeonsAndDragonsRouteMiddleware)
    .use(ErrorMiddleware);

if (process.env.NODE_ENV === 'develop') {
    autoSwagger(RoutesWrapper.declareRoutes(), { title: 'dungeons&dragons5e' })
        .then((_result: any) => {
            logger('info', 'swagger document generated');
        })
        .catch((error: any) => {
            console.log(error);
        });
}

app.use('/api-docs/dnd5e', swaggerUI.serve).use('/api-docs/dnd5e', swaggerUI.setup(SwaggerDocumentDnD5E));

logger('info', 'app started');

export default app;
