import 'express-async-errors';

import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import { createAutoSwagger } from '@tablerise/auto-swagger';
import { ApplicationContract } from 'src/types/modules/core/Application';
import DatabaseManagement from '@tablerise/database-management';
import { createServer } from 'http';
import {
    campaignsGroup,
    charactersGroup,
    dndGroup,
    middlewareIgnore,
    swaggerConfig,
    usersGroup,
} from 'src/domains/common/helpers/swaggerConfigs';

export default class Application {
    private readonly usersRoutes;
    private readonly oAuthRoutes;
    private readonly campaignsRoutes;
    private readonly charactersRoutes;
    private readonly backgroundsRoutes;
    private readonly classesRoutes;
    private readonly equipmentRoutes;
    private readonly featsRoutes;
    private readonly racesRoutes;
    private readonly spellsRoutes;
    private readonly verifyUserMiddleware;
    private readonly errorMiddleware;
    private readonly socketIO;
    private readonly logger;

    constructor({
        usersRoutes,
        oAuthRoutes,
        campaignsRoutes,
        charactersRoutes,
        backgroundsRoutes,
        classesRoutes,
        equipmentRoutes,
        featsRoutes,
        racesRoutes,
        spellsRoutes,
        verifyUserMiddleware,
        errorMiddleware,
        socketIO,
        logger,
    }: ApplicationContract) {
        this.usersRoutes = usersRoutes;
        this.oAuthRoutes = oAuthRoutes;
        this.campaignsRoutes = campaignsRoutes;
        this.charactersRoutes = charactersRoutes;
        this.backgroundsRoutes = backgroundsRoutes;
        this.classesRoutes = classesRoutes;
        this.equipmentRoutes = equipmentRoutes;
        this.featsRoutes = featsRoutes;
        this.racesRoutes = racesRoutes;
        this.spellsRoutes = spellsRoutes;
        this.verifyUserMiddleware = verifyUserMiddleware;
        this.errorMiddleware = errorMiddleware;
        this.socketIO = socketIO;
        this.logger = logger;
    }

    public setupExpress(): express.Application {
        const app = express();
        const swagger = createAutoSwagger(swaggerConfig);

        swagger.bindMiddleware('/users', this.verifyUserMiddleware.userStatus, middlewareIgnore.userStatus);
        swagger.bindMiddleware('/campaigns', this.verifyUserMiddleware.userStatus);
        swagger.bindMiddleware('/characters', this.verifyUserMiddleware.userStatus);

        app.use(express.json())
            .use(
                cors({
                    origin: process.env.CORS_ORIGIN,
                    credentials: true,
                })
            )
            .use(passport.initialize())
            .use(cookieParser(process.env.COOKIE_SECRET))
            .use(helmet())
            .use('/health', (req, res) => res.send('OK!'))
            .use(swagger.provideRoutes(this.usersRoutes.routes(), usersGroup).register())
            .use(swagger.provideRoutes(this.oAuthRoutes.routes(), usersGroup).register())
            .use(swagger.provideRoutes(this.campaignsRoutes.routes(), campaignsGroup).register())
            .use(swagger.provideRoutes(this.charactersRoutes.routes(), charactersGroup).register())
            .use(swagger.provideRoutes(this.backgroundsRoutes.routes(), dndGroup).register())
            .use(swagger.provideRoutes(this.classesRoutes.routes(), dndGroup).register())
            .use(swagger.provideRoutes(this.equipmentRoutes.routes(), dndGroup).register())
            .use(swagger.provideRoutes(this.featsRoutes.routes(), dndGroup).register())
            .use(swagger.provideRoutes(this.racesRoutes.routes(), dndGroup).register())
            .use(swagger.provideRoutes(this.spellsRoutes.routes(), dndGroup).register())
            .use(swagger.docs())
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
