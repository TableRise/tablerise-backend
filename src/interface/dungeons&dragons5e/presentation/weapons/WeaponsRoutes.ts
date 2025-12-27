import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';
import { WeaponsRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/weapons/WeaponsRoutes';

const BASE_PATH = '/system/dnd5e/weapons';

export default class WeaponsRoutes {
    private readonly weaponsController;
    private readonly verifyIdMiddleware;

    constructor({ weaponsController, verifyIdMiddleware }: WeaponsRoutesContract) {
        this.weaponsController = weaponsController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.weaponsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'weapons',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this.weaponsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'weapons',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this.weaponsController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
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
                controller: this.weaponsController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'weapons',
                },
            },
        ] as unknown as routeInstance[];
    }
}
