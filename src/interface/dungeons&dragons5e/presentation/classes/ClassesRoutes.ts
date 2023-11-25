import 'src/interface/common/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/domains/common/helpers/parametersWrapper';
import { ClassesRoutesContract } from 'src/types/dungeons&dragons5e/contracts/presentation/classes/ClassesRoutes';

const BASE_PATH = '/dnd5e/classes';

export default class ClassesRoutes {
    private readonly _classesController;
    private readonly _verifyIdMiddleware;

    constructor({ classesController, verifyIdMiddleware }: ClassesRoutesContract) {
        this._classesController = classesController;
        this._verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._classesController.getAll,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'classes',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this._classesController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'classes',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._classesController.get,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'classes',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this._classesController.toggleAvailability,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'classes',
                },
            },
        ] as unknown as routeInstance[];
    }
}
