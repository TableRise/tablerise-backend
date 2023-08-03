import 'module-alias/register';
import 'express-async-errors';
import 'dotenv/config';

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';

import RoutesWrapper from 'src/routes/RoutesWrapper';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';

const autoSwagger = require('@tablerise/auto-swagger');
const logger = require('@tablerise/dynamic-logger');

const app: Application = express();

app.use(express.json())
    .use(cors())
    .use(helmet())
    .use('/health', (req, res) => res.send('OK!'))
    .use('/system', RoutesWrapper.routes().system)
    .use('/realms', RoutesWrapper.routes().realms)
    .use('/gods', RoutesWrapper.routes().gods)
    .use('/backgrounds', RoutesWrapper.routes().backgrounds)
    .use('/feats', RoutesWrapper.routes().feats)
    .use('/weapons', RoutesWrapper.routes().weapons)
    .use('/armors', RoutesWrapper.routes().armors)
    .use('/items', RoutesWrapper.routes().items)
    .use('/races', RoutesWrapper.routes().races)
    .use('/classes', RoutesWrapper.routes().classes)
    .use('/magicItems', RoutesWrapper.routes().magicItems)
    .use('/spells', RoutesWrapper.routes().spells)
    .use('/wikis', RoutesWrapper.routes().wikis)
    .use('/monsters', RoutesWrapper.routes().monsters)
    .use(ErrorMiddleware);

if (process.env.NODE_ENV === 'dev') {
    logger('info', 'swagger document generated');
    autoSwagger(RoutesWrapper.declareRoutes());
}

// eslint-disable-next-line import/first
import SwaggerDocument from '../api-docs/swagger-doc.json';

app.use('/api-docs', swaggerUI.serve).use('/api-docs', swaggerUI.setup(SwaggerDocument));

logger('info', 'app started');
export default app;
