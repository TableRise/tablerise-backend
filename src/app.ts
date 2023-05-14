import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/health', (req, res) => res.send('OK'));

export default app;
