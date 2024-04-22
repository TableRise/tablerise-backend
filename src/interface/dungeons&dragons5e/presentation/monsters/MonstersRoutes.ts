import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/domains/common/helpers/parametersWrapper';
import { MonstersRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/monsters/MonstersRoutes';

const BASE_PATH = '/system/dnd5e/monsters';

export default class MonstersRoutes {
    private readonly _monstersController;
    private readonly _verifyIdMiddleware;

    constructor({ monstersController, verifyIdMiddleware }: MonstersRoutesContract) {
        this._monstersController = monstersController;
        this._verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._monstersController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'monsters',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this._monstersController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'monsters',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._monstersController.get,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'monsters',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this._monstersController.toggleAvailability,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'monsters',
                },
            },
        ] as unknown as routeInstance[];
    }
}
