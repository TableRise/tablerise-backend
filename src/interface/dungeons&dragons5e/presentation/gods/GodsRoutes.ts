import 'src/interface/common/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/domains/common/helpers/parametersWrapper';
import { GodsRoutesContract } from 'src/types/dungeons&dragons5e/contracts/presentation/gods/GodsRoutes';

const BASE_PATH = '/dnd5e/gods';

export default class GodsRoutes {
    private readonly _godsController;
    private readonly _verifyIdMiddleware;

    constructor({ godsController, verifyIdMiddleware }: GodsRoutesContract) {
        this._godsController = godsController;
        this._verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._godsController.getAll,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'gods',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this._godsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'gods',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._godsController.get,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'gods',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this._godsController.toggleAvailability,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'gods',
                },
            },
        ] as unknown as routeInstance[];
    }
}
