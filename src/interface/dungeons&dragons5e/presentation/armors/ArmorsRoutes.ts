import 'src/interface/common/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/infra/helpers/user/parametersWrapper';
import { ArmorsRoutesContract } from 'src/types/dungeons&dragons5e/contracts/presentation/ArmorsRoutes';

const BASE_PATH = '/dnd5e/armors';

export default class ArmorsRoutes {
    private readonly _armorsController;
    private readonly _verifyIdMiddleware;
    private readonly _verifyBooleanQueryMiddleware;

    constructor({
        armorsController,
        verifyIdMiddleware,
        verifyBooleanQueryMiddleware
    }: ArmorsRoutesContract) {
        this._armorsController = armorsController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._verifyBooleanQueryMiddleware = verifyBooleanQueryMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller:  this._armorsController.getAll,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'armors',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this._armorsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'armors',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._armorsController.get,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware, 
                        passport.authenticate('bearer', { session: false })
                    ],
                    authentication: true,
                    tag: 'armors',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
                controller: this._armorsController.toggleAvailability,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        this._verifyBooleanQueryMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'armors',
                },
            },
        ] as unknown as routeInstance[];
    }
}
