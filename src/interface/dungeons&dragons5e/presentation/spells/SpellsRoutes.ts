import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { z } from 'zod';
import { SpellsRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/spells/SpellsRoutes';

const BASE_PATH = '/system/dnd5e/spells';
const desc = {
    getAll: 'List all D&D 5e spells available in the system.',
    getDisabled: 'List D&D 5e spells currently marked as unavailable.',
    getByLevel: 'List D&D 5e spells filtered by spell level.',
    getById: 'Get one D&D 5e spell by id.',
    toggleAvailability: 'Enable or disable a D&D 5e spell.',
};

const queryLevelSchema = z.object({
    queryLevel: z.preprocess((value) => {
        if (typeof value === 'string') return Number(value);
        return value;
    }, z.number().int().nonnegative()),
});

const availabilityQuerySchema = z.object({
    availability: z.preprocess((value) => {
        if (typeof value === 'string') return value === 'true';
        return value;
    }, z.boolean()),
});

export default class SpellsRoutes {
    private readonly spellsController;
    private readonly verifyIdMiddleware;

    constructor({ spellsController, verifyIdMiddleware }: SpellsRoutesContract) {
        this.spellsController = spellsController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            { basePath: BASE_PATH },
            {
                method: 'get',
                path: '/',
                controller: this.spellsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'spells',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: '/disabled',
                controller: this.spellsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'spells',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: '/by-level',
                controller: this.spellsController.getByLevel,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    schemas: [{ query: queryLevelSchema }],
                    tag: 'spells',
                    description: desc.getByLevel,
                },
            },
            {
                method: 'get',
                path: '/:id',
                controller: this.spellsController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'spells',
                    description: desc.getById,
                },
            },
            {
                method: 'patch',
                path: '/:id',
                controller: this.spellsController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ query: availabilityQuerySchema }],
                    tag: 'spells',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
