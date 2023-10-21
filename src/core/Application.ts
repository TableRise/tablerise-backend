import 'express-async-errors';

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import { ApplicationContract } from '../types/contracts/Application';
import DatabaseManagement from '@tablerise/database-management';

export default class Application extends ApplicationContract {
    constructor({ usersRoutesMiddleware, errorMiddleware, logger }: ApplicationContract) {
        super();
        this.usersRoutesMiddleware = usersRoutesMiddleware;
        this.errorMiddleware = errorMiddleware;
        this.logger = logger;
    }

    private _setupExpress(): express.Application {
        const COOKIE_AGE = 1000 * 60 * 60 * 120;
        const app = express();

        app.use(express.json())
            .use(helmet())
            .use(cors())
            .use(
                session({
                    secret: (process.env.COOKIE_SECRET as string) || 'catfish',
                    resave: false,
                    saveUninitialized: false,
                    cookie: { maxAge: COOKIE_AGE },
                })
            )
            .use(passport.session())
            .use('/health', (req, res) => res.send('OK!'))
            .use(this.usersRoutesMiddleware.get())
            .use(this.errorMiddleware);
        
        return app;
    }

    public async start(): Promise<void> {
        const port = process.env.PORT as string;
        const app = this._setupExpress();

        await DatabaseManagement.connect(true)
            .then(() => {
                this.logger('info', '[Application - Database connection instanciated]');
            })
            .catch(() => {
                this.logger('error', '[Application - Database connection failed]');
            });

        app.listen(port, () => {
            this.logger('info', `[Application - Server started in port => ${port}]`)
        });
    }
}
