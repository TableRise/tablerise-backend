import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';
import { EquipmentRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/equipment/EquipmentRoutes';

const BASE_PATH = '/system/dnd5e/equipment';
const desc = {
    getAll: 'List all D&D 5e equipment available in the system.',
    getDisabled: 'List D&D 5e equipment currently marked as unavailable.',
    getById: 'Get one D&D 5e equipment item by id.',
    toggleAvailability: 'Enable or disable a D&D 5e equipment item.',
};

export default class EquipmentRoutes {
    private readonly equipmentController;
    private readonly verifyIdMiddleware;

    constructor({ equipmentController, verifyIdMiddleware }: EquipmentRoutesContract) {
        this.equipmentController = equipmentController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.equipmentController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'equipment',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this.equipmentController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'equipment',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this.equipmentController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'equipment',
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
                controller: this.equipmentController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'equipment',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
