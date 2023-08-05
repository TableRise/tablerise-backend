/* eslint-disable no-console */
import 'module-alias/register';
import 'express-async-errors';

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';

import RoutesWrapper from 'src/routes/RoutesWrapper';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';
import SwaggerDocument from '../api-docs/swagger-doc.json';

const autoSwagger = require('@tablerise/auto-swagger');
const logger = require('@tablerise/dynamic-logger');

const app: Application = express();

app
  .use(express.json())
  .use(cors())
  .use(helmet())
  .use('/health', (req, res) => res.send('OK!'))
  .use('/system', RoutesWrapper.routes().system)
  .use('/realms', RoutesWrapper.routes().realms)
  .use('/gods', RoutesWrapper.routes().gods)
  .use(ErrorMiddleware);

if (process.env.NODE_ENV === 'dev') {
  autoSwagger(RoutesWrapper.declareRoutes())
    .then((_result: any) => logger('info', 'swagger document generated'))
    .catch((error: any) => { console.log(error); });
}

app
  .use('/api-docs', swaggerUI.serve)
  .use('/api-docs', swaggerUI.setup(SwaggerDocument));

export default app;
