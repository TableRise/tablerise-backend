import 'module-alias/register';
import 'express-async-errors';

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import RoutesWrapper from 'src/routes/index';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';

const autoSwagger = require('@tablerise/auto-swagger');

const app: Application = express();

app
  .use(express.json())
  .use(cors())
  .use(helmet())
  .use('/health', (req, res) => res.send('OK!'))
  .use(ErrorMiddleware);

autoSwagger(RoutesWrapper.declareRoutes());

export default app;
