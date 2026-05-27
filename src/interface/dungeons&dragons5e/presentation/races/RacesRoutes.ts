import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';
import { RacesRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/races/RacesRoutes';

const BASE_PATH = '/system/dnd5e/races';
const desc = {
    getAll: 'List all D&D 5e races available in the system.',
    getDisabled: 'List D&D 5e races currently marked as unavailable.',
    getById: 'Get one D&D 5e race by id.',
    toggleAvailability: 'Enable or disable a D&D 5e race.',
};

export default class RacesRoutes {
    private readonly RacesController;
    private readonly verifyIdMiddleware;

    constructor({ racesController, verifyIdMiddleware }: RacesRoutesContract) {
        this.RacesController = racesController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.RacesController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'races',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this.RacesController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'races',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this.RacesController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'races',
                    description: desc.getById,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this.RacesController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'races',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
