import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';
import { MonstersRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/monsters/MonstersRoutes';

const BASE_PATH = '/system/dnd5e/monsters';

export default class MonstersRoutes {
    private readonly monstersController;
    private readonly verifyIdMiddleware;

    constructor({ monstersController, verifyIdMiddleware }: MonstersRoutesContract) {
        this.monstersController = monstersController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.monstersController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'monsters',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this.monstersController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'monsters',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this.monstersController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
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
                controller: this.monstersController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'monsters',
                },
            },
        ] as unknown as routeInstance[];
    }
}
