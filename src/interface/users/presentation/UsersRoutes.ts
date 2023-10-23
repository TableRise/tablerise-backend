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
                    description: 'This route receives an userId and send an email to verify the user. ' +
                        'The user status is changed and is necessary to confirm the email using the code ' +
                        'send in the email message to perform any further operations.'
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
                    description: 'Route for user registration, after register email confirmation is needed.'
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
                    description: 'Route for user login'
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
                    description: 'This route must be used to confirm an account that was recently created ' +
                        'the route receives the param "code", that was send to the user email in the signup.'
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
                    description: 'Route for 2FA activation'
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
                    description: 'Route for 2FA reset, verification code send to user email is needed.'
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
                    description: 'Route for email update, verification code send to user email is needed. ' +
                        'If the user has 2FA enabled the 2FA token will be needed as well.'
                },
            },
            {
                method: 'delete',
                path: `${BASE_PATH}/:id/delete`,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'token', type: 'string', required: 'off' }])],
                controller: this._usersController.delete,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                        this._authorizationMiddleware.twoFactor,
                    ],
                    authentication: true,
                    tag: 'management',
                    description: 'Route for user deletion, if the user has 2FA enabled the 2FA token will be needed.'
                },
            },
        ] as unknown as routeInstance[];
    }
}
