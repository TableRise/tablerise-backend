import 'src/interface/users/strategies/LocalStrategy';
import 'src/interface/common/strategies/BearerStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/infra/helpers/user/parametersWrapper';
import mocks from 'src/infra/datafakers/users/mocks/users';
import { UsersRoutesContract } from 'src/types/users/contracts/presentation/UsersRoutes';

const BASE_PATH = '/profile';

export default class UsersRoutes {
    private readonly _usersController;
    private readonly _verifyIdMiddleware;
    private readonly _authorizationMiddleware;
    private readonly _verifyEmailCodeMiddleware;

    constructor({
        usersController,
        authorizationMiddleware,
        verifyIdMiddleware,
        verifyEmailCodeMiddleware,
    }: UsersRoutesContract) {
        this._usersController = usersController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._verifyEmailCodeMiddleware = verifyEmailCodeMiddleware;
        this._authorizationMiddleware = authorizationMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}/all`,
                controller: this._usersController.getUsers,
                options: {
                    middlewares: [
                        passport.authenticate('bearer', { session: false }),
                        this._authorizationMiddleware.checkAdminRole,
                    ],
                    authentication: true,
                    tag: 'recover',
                    description: 'This route returns all users registered in database',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._usersController.getUserById,
                options: {
                    middlewares: [passport.authenticate('bearer', { session: false })],
                    authentication: true,
                    tag: 'recover',
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id/verify`,
                parameters: [
                    ...generateQueryParam(2, [
                        { name: 'email', type: 'string' },
                        { name: 'newEmail', type: 'string', required: 'off' },
                    ]),
                ],
                controller: this._usersController.verifyEmail,
                options: {
                    authentication: false,
                    tag: 'authentication',
                    description:
                        'This route receives an userId and send an email to verify the user. ' +
                        'The user status is changed and is necessary to confirm the email using the code ' +
                        'send in the email message to perform any further operations.',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/register`,
                controller: this._usersController.register,
                schema: mocks.userPayload,
                options: {
                    authentication: false,
                    tag: 'register',
                    description:
                        'Route for user registration, after register email confirmation is needed.',
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/login`,
                controller: this._usersController.login,
                schema: mocks.userLogin,
                options: {
                    middlewares: [passport.authenticate('local', { session: false })],
                    authentication: false,
                    tag: 'authentication',
                    description: 'Route for user login',
                },
            },
            {
                method: 'put',
                path: `${BASE_PATH}/:id/update`,
                parameters: [...generateIDParam()],
                controller: this._usersController.update,
                schema: mocks.userUpdate,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'management',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/confirm`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'code', type: 'string' }]),
                ],
                controller: this._usersController.confirmCode,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        this._verifyEmailCodeMiddleware.verify,
                    ],
                    authentication: false,
                    tag: 'register',
                    description:
                        'This route must be used to confirm an account that was recently created ' +
                        'the route receives the param "code", that was send to the user email in the signup.',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/activate`,
                parameters: [...generateIDParam()],
                controller: this._usersController.activateTwoFactor,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'management',
                    description: 'Route for 2FA activation',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/reset`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'code', type: 'string' }]),
                ],
                controller: this._usersController.resetTwoFactor,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                        this._verifyEmailCodeMiddleware.verify,
                    ],
                    authentication: true,
                    tag: 'management',
                    description:
                        'Route for 2FA reset, verification code send to user email is needed.',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/email`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(2, [
                        { name: 'code', type: 'string' },
                        { name: 'token', type: 'string', required: 'off' },
                    ]),
                ],
                controller: this._usersController.updateEmail,
                schema: mocks.userEmailUpdate,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                        this._authorizationMiddleware.twoFactor,
                        this._verifyEmailCodeMiddleware.verify,
                    ],
                    authentication: true,
                    tag: 'management',
                    description:
                        'Route for email update, verification code send to user email is needed. ' +
                        'If the user has 2FA enabled the 2FA token will be needed as well.',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/game-info`,
                controller: this._usersController.updateGameInfo,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(3, [
                        { name: 'infoId', type: 'string' },
                        { name: 'targetInfo', type: 'string' },
                        { name: 'operation', type: 'string' },
                    ]),
                ],
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                    ],
                    authentication: true,
                    tag: 'management',
                    description:
                        'Route to update user game info. Params - infoId: expects a user id. Query - id: id to add at the info; info: "badges" | "campaigns" | "characters"; operation: "add" | "remove"',
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/reset`,
                controller: this._usersController.resetProfile,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'token', type: 'string' }]),
                ],
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
            {
                method: 'delete',
                path: `${BASE_PATH}/:id/delete`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [
                        { name: 'token', type: 'string', required: 'off' },
                    ]),
                ],
                controller: this._usersController.delete,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('bearer', { session: false }),
                        this._authorizationMiddleware.twoFactor,
                    ],
                    authentication: true,
                    tag: 'management',
                    description:
                        'Route for user deletion, if the user has 2FA enabled the 2FA token will be needed.',
                },
            },
        ] as unknown as routeInstance[];
    }
}
