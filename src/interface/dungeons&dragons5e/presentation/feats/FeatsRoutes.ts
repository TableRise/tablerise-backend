import 'src/interface/common/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/infra/helpers/user/parametersWrapper';
import { FeatsRoutesContract } from 'src/types/dungeons&dragons5e/contracts/presentation/feats/FeatsRoutes';

const BASE_PATH = '/dnd5e/feats';

export default class FeatsRoutes {
    private readonly _featsController;
    private readonly _verifyIdMiddleware;
    private readonly _verifyBooleanQueryMiddleware;

    constructor({
        featsController,
        verifyIdMiddleware,
        verifyBooleanQueryMiddleware,
    }: FeatsRoutesContract) {
        this._featsController = featsController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._verifyBooleanQueryMiddleware = verifyBooleanQueryMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._featsController.getAll,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'feats',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this._featsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'feats',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._featsController.get,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'feats',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this._featsController.toggleAvailability,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'feats',
                },
            },
        ] as unknown as routeInstance[];
    }
}
