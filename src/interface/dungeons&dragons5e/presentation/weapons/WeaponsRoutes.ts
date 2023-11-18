import 'src/interface/common/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/infra/helpers/user/parametersWrapper';
import { WeaponsRoutesContract } from 'src/types/dungeons&dragons5e/contracts/presentation/weapons/WeaponsRoutes';

const BASE_PATH = '/dnd5e/weapons';

export default class WeaponsRoutes {
    private readonly _weaponsController;
    private readonly _verifyIdMiddleware;
    private readonly _verifyBooleanQueryMiddleware;

    constructor({
        weaponsController,
        verifyIdMiddleware,
        verifyBooleanQueryMiddleware,
    }: WeaponsRoutesContract) {
        this._weaponsController = weaponsController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._verifyBooleanQueryMiddleware = verifyBooleanQueryMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._weaponsController.getAll,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'weapons',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this._weaponsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'weapons',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._weaponsController.get,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'weapons',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this._weaponsController.toggleAvailability,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        this._verifyBooleanQueryMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'weapons',
                },
            },
        ] as unknown as routeInstance[];
    }
}
