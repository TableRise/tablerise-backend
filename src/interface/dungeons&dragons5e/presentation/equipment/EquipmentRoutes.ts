import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import { z } from 'zod';
import { EquipmentRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/equipment/EquipmentRoutes';

const BASE_PATH = '/system/dnd5e/equipment';
const desc = {
    getAll: 'List all D&D 5e equipment available in the system.',
    getDisabled: 'List D&D 5e equipment currently marked as unavailable.',
    getById: 'Get one D&D 5e equipment item by id.',
    toggleAvailability: 'Enable or disable a D&D 5e equipment item.',
};

const availabilityQuerySchema = z.object({
    availability: z.preprocess((value) => {
        if (typeof value === 'string') return value === 'true';
        return value;
    }, z.boolean()),
});

export default class EquipmentRoutes {
    private readonly equipmentController;
    private readonly verifyIdMiddleware;

    constructor({ equipmentController, verifyIdMiddleware }: EquipmentRoutesContract) {
        this.equipmentController = equipmentController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            { basePath: BASE_PATH },
            {
                method: 'get',
                path: '/',
                controller: this.equipmentController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'equipment',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: '/disabled',
                controller: this.equipmentController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'equipment',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: '/:id',
                controller: this.equipmentController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'equipment',
                    description: desc.getById,
                },
            },
            {
                method: 'patch',
                path: '/:id',
                controller: this.equipmentController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ query: availabilityQuerySchema }],
                    tag: 'equipment',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
