import 'src/interface/users/strategies/LocalStrategy';
import 'src/interface/users/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/infra/helpers/user/parametersWrapper';
import mock from 'src/infra/mocks/user';
import { UsersRoutesContract } from 'src/types/contracts/users/presentation/UsersRoutes';

const BASE_PATH = '/profile';

export default class UsersRoutes {
    private readonly _usersController;
    private readonly _verifyIdMiddleware;
    private readonly _authorizationMiddleware;

    constructor({ usersController, authorizationMiddleware, verifyIdMiddleware }: UsersRoutesContract) {
        this._usersController = usersController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._authorizationMiddleware = authorizationMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}/:id/verify`,
                parameters: [...generateIDParam()],
                controller: this._usersController.verifyEmail,
                options: {
                    middlewares: [this._verifyIdMiddleware],
                    authentication: false,
                    tag: 'authentication',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/register`,
                controller: this._usersController.register,
                schema: mock.user.userPayload,
                options: {
                    authentication: false,
                    tag: 'register',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/login`,
                controller: this._usersController.login,
                schema: mock.user.userLogin,
                options: {
                    middlewares: [passport.authenticate('local', { session: false })],
                    authentication: false,
                    tag: 'authentication',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/confirm`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'code', type: 'string' }])],
                controller: this._usersController.confirmCode,
                options: {
                    middlewares: [this._verifyIdMiddleware],
                    authentication: false,
                    tag: 'register',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/activate`,
                parameters: [...generateIDParam()],
                controller: this._usersController.activateTwoFactor,
                options: {
                    middlewares: [this._verifyIdMiddleware, passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'management',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/reset`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'code', type: 'string' }])],
                controller: this._usersController.resetTwoFactor,
                options: {
                    middlewares: [this._verifyIdMiddleware, passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'management',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/email`,
                parameters: [...generateIDParam(), ...generateQueryParam(2, [
                    { name: 'code', type: 'string' },
                    { name: 'token', type: 'string', required: 'off' }
                ])],
                controller: this._usersController.updateEmail,
                schema: mock.user.userEmailUpdate,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                        this._authorizationMiddleware.twoFactor
                    ],
                    authentication: true,
                    tag: 'management',
                },
            },
            {
                method: 'delete',
                path: `${BASE_PATH}/:id/delete`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'token', type: 'string' }])],
                controller: this._usersController.delete,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                        this._authorizationMiddleware.twoFactor,
                    ],
                    authentication: true,
                    tag: 'management',
                },
            },
        ] as routeInstance[];
    }
}
