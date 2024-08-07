import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/domains/common/helpers/parametersWrapper';
import { MagicItemsRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/magicItems/MagicItemsRoutes';

const BASE_PATH = '/system/dnd5e/magicItems';

export default class MagicItemsRoutes {
    private readonly _magicItemsController;
    private readonly _verifyIdMiddleware;

    constructor({ magicItemsController, verifyIdMiddleware }: MagicItemsRoutesContract) {
        this._magicItemsController = magicItemsController;
        this._verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._magicItemsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'magicItems',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this._magicItemsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'magicItems',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._magicItemsController.get,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'magicItems',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this._magicItemsController.toggleAvailability,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'magicItems',
                },
            },
        ] as unknown as routeInstance[];
    }
}
