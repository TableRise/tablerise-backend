import 'express-async-errors';

import express from 'express';
import session from 'cookie-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import { ApplicationContract } from 'src/types/users/contracts/Application';
import DatabaseManagement from '@tablerise/database-management';

export default class Application {
    private readonly _dungeonsAndDragonsRoutesMiddleware;
    private readonly _usersRoutesMiddleware;
    private readonly _swaggerGenerator;
    private readonly _accessHeadersMiddleware;
    private readonly _errorMiddleware;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRoutesMiddleware,
        usersRoutesMiddleware,
        errorMiddleware,
        swaggerGenerator,
        accessHeadersMiddleware,
        logger,
    }: ApplicationContract) {
        this._dungeonsAndDragonsRoutesMiddleware = dungeonsAndDragonsRoutesMiddleware;
        this._usersRoutesMiddleware = usersRoutesMiddleware;
        this._swaggerGenerator = swaggerGenerator;
        this._accessHeadersMiddleware = accessHeadersMiddleware;
        this._errorMiddleware = errorMiddleware;
        this._logger = logger;
    }

    public setupExpress(): express.Application {
        const app = express();

        app.use(express.json())
            .use(helmet())
            .use(cors())
            .use(session({ secret: (process.env.COOKIE_SECRET as string) || 'catfish' }))
            .use(passport.session())
            .use('/health', (req, res) => res.send('OK!'))
            .use(this._swaggerGenerator)
            .use(this._accessHeadersMiddleware)
            .use(this._usersRoutesMiddleware.get())
            .use(this._dungeonsAndDragonsRoutesMiddleware.get())
            .use(this._errorMiddleware);

        return app;
    }

    public async start(): Promise<void> {
        const port = process.env.PORT as string;
        const app = this.setupExpress();

        await DatabaseManagement.connect(true, 'mongoose')
            .then(() => {
                this._logger(
                    'info',
                    '[ Application - Database connection instanciated ]',
                    true
                );
            })
            .catch(() => {
                this._logger('error', '[ Application - Database connection failed ]');
            });

        app.listen(port, () => {
            this._logger(
                'info',
                `[ Application - Server started in port -> ${port} ]`,
                true
            );
        });
    }
}
