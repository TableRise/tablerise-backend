import 'express-async-errors';

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import { ApplicationContract } from 'src/types/contracts/Application';
import DatabaseManagement from '@tablerise/database-management';

export default class Application {
    private readonly _usersRoutesMiddleware;
    private readonly _swaggerGenerator;
    private readonly _errorMiddleware;
    private readonly _logger;

    constructor({
        usersRoutesMiddleware,
        errorMiddleware,
        swaggerGenerator,
        logger,
    }: ApplicationContract) {
        this._usersRoutesMiddleware = usersRoutesMiddleware;
        this._swaggerGenerator = swaggerGenerator;
        this._errorMiddleware = errorMiddleware;
        this._logger = logger;
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
            .use(this._swaggerGenerator)
            .use(this._usersRoutesMiddleware.get())
            .use(this._errorMiddleware);

        return app;
    }

    public async start(): Promise<void> {
        const port = process.env.PORT as string;
        const app = this._setupExpress();

        await DatabaseManagement.connect(true)
            .then(() => {
                this._logger('info', '[Application - Database connection instanciated]');
            })
            .catch(() => {
                this._logger('error', '[Application - Database connection failed]');
            });

        app.listen(port, () => {
            this._logger('info', `[Application - Server started in port -> ${port}]`);
        });
    }
}
