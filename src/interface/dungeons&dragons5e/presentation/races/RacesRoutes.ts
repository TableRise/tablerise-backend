import 'src/interface/common/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/infra/helpers/user/parametersWrapper';
import { RacesRoutesContract } from 'src/types/dungeons&dragons5e/contracts/presentation/races/RacesRoutes';

const BASE_PATH = '/dnd5e/races';

export default class RacesRoutes {
    private readonly _RacesController;
    private readonly _verifyIdMiddleware;

    constructor({ racesController, verifyIdMiddleware }: RacesRoutesContract) {
        this._RacesController = racesController;
        this._verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._RacesController.getAll,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'races',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this._RacesController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'races',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._RacesController.get,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'races',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this._RacesController.toggleAvailability,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        this._verifyBooleanQueryMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'races',
                },
            },
        ] as unknown as routeInstance[];
    }
}
