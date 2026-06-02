import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { z } from 'zod';
import { RacesRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/races/RacesRoutes';

const BASE_PATH = '/system/dnd5e/races';
const desc = {
    getAll: 'List all D&D 5e races available in the system.',
    getDisabled: 'List D&D 5e races currently marked as unavailable.',
    getById: 'Get one D&D 5e race by id.',
    toggleAvailability: 'Enable or disable a D&D 5e race.',
};

const availabilityQuerySchema = z.object({
    availability: z.preprocess((value) => {
        if (typeof value === 'string') return value === 'true';
        return value;
    }, z.boolean()),
});

export default class RacesRoutes {
    private readonly RacesController;
    private readonly verifyIdMiddleware;

    constructor({ racesController, verifyIdMiddleware }: RacesRoutesContract) {
        this.RacesController = racesController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            { basePath: BASE_PATH },
            {
                method: 'get',
                path: '/',
                controller: this.RacesController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'races',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: '/disabled',
                controller: this.RacesController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'races',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: '/:id',
                controller: this.RacesController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'races',
                    description: desc.getById,
                },
            },
            {
                method: 'patch',
                path: '/:id',
                controller: this.RacesController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ query: availabilityQuerySchema }],
                    tag: 'races',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
