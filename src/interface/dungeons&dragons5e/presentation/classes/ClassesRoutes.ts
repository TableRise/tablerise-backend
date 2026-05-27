import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';
import { ClassesRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/classes/ClassesRoutes';

const BASE_PATH = '/system/dnd5e/classes';
const desc = {
    getAll: 'List all D&D 5e classes available in the system.',
    getDisabled: 'List D&D 5e classes currently marked as unavailable.',
    getById: 'Get one D&D 5e class by id.',
    toggleAvailability: 'Enable or disable a D&D 5e class.',
};

export default class ClassesRoutes {
    private readonly classesController;
    private readonly verifyIdMiddleware;

    constructor({ classesController, verifyIdMiddleware }: ClassesRoutesContract) {
        this.classesController = classesController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.classesController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'classes',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this.classesController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'classes',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this.classesController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'classes',
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
                controller: this.classesController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'classes',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
