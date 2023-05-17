import 'express-async-errors';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from 'src/routes/index';
import ErrorMiddleware from 'src/middlewares/ErrorMiddleware';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/health', (req, res) => res.send('OK'));
app.use('/system', routes.systemRoutes);

app.use(ErrorMiddleware);

export default app;
