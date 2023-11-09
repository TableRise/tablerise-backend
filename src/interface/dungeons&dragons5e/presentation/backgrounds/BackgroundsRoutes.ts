import 'src/interface/common/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { BackgroundsRoutesContract } from 'src/types/dungeons&dragons5e/contracts/presentation/BackgroundsRoutes';

const BASE_PATH = '/dnd5e/backgrounds';

export default class BackgroundRoutes {
    private readonly _backgroundsController;
    private readonly _verifyIdMiddleware;
    private readonly _verifyBooleanQueryMiddleware;

    constructor({
        backgroundsController,
        verifyIdMiddleware,
        verifyBooleanQueryMiddleware,
    }: BackgroundsRoutesContract) {
        this._backgroundsController = backgroundsController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._verifyBooleanQueryMiddleware = verifyBooleanQueryMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._backgroundsController.getAll,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'backgrounds',
                },
            },
        ] as unknown as routeInstance[];
    }
}
