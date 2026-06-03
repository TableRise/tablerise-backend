import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { z } from 'zod';
import { BackgroundsRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsRoutes';

const BASE_PATH = '/system/dnd5e/backgrounds';
const desc = {
    getAll: 'List all D&D 5e backgrounds available in the system.',
    getDisabled: 'List D&D 5e backgrounds currently marked as unavailable.',
    getById: 'Get one D&D 5e background by id.',
    toggleAvailability: 'Enable or disable a D&D 5e background.',
};

const availabilityQuerySchema = z.object({
    availability: z.preprocess((value) => {
        if (typeof value === 'string') return value === 'true';
        return value;
    }, z.boolean()),
});

export default class BackgroundsRoutes {
    private readonly backgroundsController;
    private readonly verifyIdMiddleware;

    constructor({ backgroundsController, verifyIdMiddleware }: BackgroundsRoutesContract) {
        this.backgroundsController = backgroundsController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            { basePath: BASE_PATH },
            {
                method: 'get',
                path: '/',
                controller: this.backgroundsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'backgrounds',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: '/disabled',
                controller: this.backgroundsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'backgrounds',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: '/:id',
                controller: this.backgroundsController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'backgrounds',
                    description: desc.getById,
                },
            },
            {
                method: 'patch',
                path: '/:id',
                controller: this.backgroundsController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ query: availabilityQuerySchema }],
                    tag: 'backgrounds',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
