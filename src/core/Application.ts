import 'express-async-errors';

import express from 'express';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import { ApplicationContract } from 'src/types/modules/core/Application';
import DatabaseManagement from '@tablerise/database-management';
import { createServer } from 'http';

export default class Application {
    private readonly dungeonsAndDragonsRoutesMiddleware;
    private readonly usersRoutesMiddleware;
    private readonly campaignsRoutesMiddleware;
    private readonly charactersRoutesMiddleware;
    private readonly swaggerGenerator;
    private readonly errorMiddleware;
    private readonly socketIO;
    private readonly logger;

    constructor({
        dungeonsAndDragonsRoutesMiddleware,
        usersRoutesMiddleware,
        campaignsRoutesMiddleware,
        charactersRoutesMiddleware,
        errorMiddleware,
        swaggerGenerator,
        socketIO,
        logger,
    }: ApplicationContract) {
        this.dungeonsAndDragonsRoutesMiddleware = dungeonsAndDragonsRoutesMiddleware;
        this.usersRoutesMiddleware = usersRoutesMiddleware;
        this.campaignsRoutesMiddleware = campaignsRoutesMiddleware;
        this.charactersRoutesMiddleware = charactersRoutesMiddleware;
        this.swaggerGenerator = swaggerGenerator;
        this.errorMiddleware = errorMiddleware;
        this.socketIO = socketIO;
        this.logger = logger;
    }

    public setupExpress(): express.Application {
        const app = express();

        app.use(express.json())
            .use(
                cors({
                    origin: process.env.CORS_ORIGIN,
                    credentials: true,
                })
            )
            .use(
                session({
                    secret: (process.env.COOKIE_SECRET as string) || 'catfish',
                })
            )
            .use((req, _res, next) => {
                if (req.session && !req.session.regenerate) {
                    req.session.regenerate = (cb: () => void) => {
                        cb();
                    };
                    req.session.save = (cb: () => void) => {
                        cb();
                    };
                }
                next();
            })
            .use(passport.initialize())
            .use(passport.session())
            .use(cookieParser(process.env.COOKIE_SECRET))
            .use(helmet())
            .use('/health', (req, res) => res.send('OK!'))
            .use(this.swaggerGenerator)
            .use(this.usersRoutesMiddleware.get())
            .use(this.campaignsRoutesMiddleware.get())
            .use(this.charactersRoutesMiddleware.get())
            .use(this.dungeonsAndDragonsRoutesMiddleware.get())
            .use(this.errorMiddleware);

        return app;
    }

    public async start(): Promise<void> {
        const port = process.env.PORT as string;
        const app = this.setupExpress();
        const server = createServer(app);

        await this.socketIO.connect(server);

        await DatabaseManagement.connect(true, 'mongoose')
            .then(() => {
                this.logger('info', '[ Application - Database connection instanciated ]', true);
            })
            .catch(() => {
                this.logger('error', '[ Application - Database connection failed ]');
            });

        server.listen(port, () => {
            this.logger('info', `[ Application - Server started in port -> ${port} ]`, true);
        });
    }
}
