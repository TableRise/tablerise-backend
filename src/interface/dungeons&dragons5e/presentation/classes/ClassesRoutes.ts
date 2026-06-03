import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { z } from 'zod';
import { ClassesRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/classes/ClassesRoutes';

const BASE_PATH = '/system/dnd5e/classes';
const desc = {
    getAll: 'List all D&D 5e classes available in the system.',
    getDisabled: 'List D&D 5e classes currently marked as unavailable.',
    getById: 'Get one D&D 5e class by id.',
    toggleAvailability: 'Enable or disable a D&D 5e class.',
};

const availabilityQuerySchema = z.object({
    availability: z.preprocess((value) => {
        if (typeof value === 'string') return value === 'true';
        return value;
    }, z.boolean()),
});

export default class ClassesRoutes {
    private readonly classesController;
    private readonly verifyIdMiddleware;

    constructor({ classesController, verifyIdMiddleware }: ClassesRoutesContract) {
        this.classesController = classesController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            { basePath: BASE_PATH },
            {
                method: 'get',
                path: '/',
                controller: this.classesController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'classes',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: '/disabled',
                controller: this.classesController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'classes',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: '/:id',
                controller: this.classesController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'classes',
                    description: desc.getById,
                },
            },
            {
                method: 'patch',
                path: '/:id',
                controller: this.classesController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ query: availabilityQuerySchema }],
                    tag: 'classes',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
