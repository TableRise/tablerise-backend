/* eslint-disable no-console */
import 'module-alias/register';
import 'express-async-errors';
import 'dotenv/config';

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import SwaggerDocument from '../api-docs/swagger-doc.json';
import swaggerUI from 'swagger-ui-express';

import RoutesWrapper from 'src/routes/RoutesWrapper';
import DungeonsAndDragonsRouteMiddleware from 'src/routes/middlewares/DungeonsAndDragonsRouteMiddleware';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';

const autoSwagger = require('@tablerise/auto-swagger');
const logger = require('@tablerise/dynamic-logger');

const app: Application = express();

app.use(express.json())
    .use(cors())
    .use(helmet())
    .use('/health', (req, res) => res.send('OK!'))
    .use(DungeonsAndDragonsRouteMiddleware)
    .use(ErrorMiddleware);

if (process.env.NODE_ENV === 'develop') {
    autoSwagger(RoutesWrapper.declareRoutes())
        .then((_result: any) => logger('info', 'swagger document generated'))
        .catch((error: any) => {
            console.log(error);
        });
}

app.use('/api-docs', swaggerUI.serve).use('/api-docs', swaggerUI.setup(SwaggerDocument));

logger('info', 'app started');

export default app;
