import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';
import { WikisRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/wikis/WikisRoutes';

const BASE_PATH = '/system/dnd5e/wikis';

export default class WikisRoutes {
    private readonly wikisController;
    private readonly verifyIdMiddleware;

    constructor({ wikisController, verifyIdMiddleware }: WikisRoutesContract) {
        this.wikisController = wikisController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.wikisController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'wikis',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this.wikisController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'wikis',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this.wikisController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'wikis',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this.wikisController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'wikis',
                },
            },
        ] as unknown as routeInstance[];
    }
}
