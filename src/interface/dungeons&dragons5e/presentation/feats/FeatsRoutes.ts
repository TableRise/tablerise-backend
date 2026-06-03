import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { z } from 'zod';
import { FeatsRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/feats/FeatsRoutes';

const BASE_PATH = '/system/dnd5e/feats';
const desc = {
    getAll: 'List all D&D 5e feats available in the system.',
    getDisabled: 'List D&D 5e feats currently marked as unavailable.',
    getById: 'Get one D&D 5e feat by id.',
    toggleAvailability: 'Enable or disable a D&D 5e feat.',
};

const availabilityQuerySchema = z.object({
    availability: z.preprocess((value) => {
        if (typeof value === 'string') return value === 'true';
        return value;
    }, z.boolean()),
});

export default class FeatsRoutes {
    private readonly featsController;
    private readonly verifyIdMiddleware;

    constructor({ featsController, verifyIdMiddleware }: FeatsRoutesContract) {
        this.featsController = featsController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            { basePath: BASE_PATH },
            {
                method: 'get',
                path: '/',
                controller: this.featsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'feats',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: '/disabled',
                controller: this.featsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'feats',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: '/:id',
                controller: this.featsController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'feats',
                    description: desc.getById,
                },
            },
            {
                method: 'patch',
                path: '/:id',
                controller: this.featsController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ query: availabilityQuerySchema }],
                    tag: 'feats',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
