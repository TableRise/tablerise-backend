import 'src/interface/users/strategies/LocalStrategy';
import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, {
    generateQueryParam,
} from 'src/domains/common/helpers/parametersWrapper';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import desc from 'src/interface/users/presentation/users/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

const BASE_PATH = '/users';

export default class UsersRoutes {
    private readonly _usersController;
    private readonly _verifyIdMiddleware;
    private readonly _authorizationMiddleware;
    private readonly _imageMiddleware;
    private readonly _verifyEmailCodeMiddleware;

    constructor({
        usersController,
        authorizationMiddleware,
        verifyIdMiddleware,
        imageMiddleware,
        verifyEmailCodeMiddleware,
    }: InterfaceDependencies['usersRoutesContract']) {
        this._usersController = usersController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._imageMiddleware = imageMiddleware;
        this._verifyEmailCodeMiddleware = verifyEmailCodeMiddleware;
        this._authorizationMiddleware = authorizationMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            // GET
            {
                method: 'get',
                path: `${BASE_PATH}/verify`,
                parameters: [
                    ...generateQueryParam(1, [{ name: 'email', type: 'string' }]),
                ],
                controller: this._usersController.verifyEmail,
                options: {
                    tag: 'authentication',
                    description: desc.verify,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/all`,
                controller: this._usersController.getUsers,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._authorizationMiddleware.checkAdminRole,
                    ],
                    tag: 'users',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/logout`,
                controller: this._usersController.logoutUser,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'authentication',
                    description: desc.logoutUser,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._usersController.getUserById,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'users',
                    description: desc.get,
                },
            },

            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/register`,
                controller: this._usersController.register,
                schema: DomainDataFaker.mocks.createUserMock,
                options: {
                    tag: 'register',
                    description: desc.register,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/login`,
                controller: this._usersController.login,
                schema: DomainDataFaker.mocks.loginMock,
                options: {
                    middlewares: [passport.authenticate('local', { session: false })],
                    tag: 'authentication',
                    description: desc.login,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/update/picture`,
                parameters: [...generateIDParam()],
                controller: this._usersController.profilePicture,
                schema: DomainDataFaker.mocks.uploadPicture,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._imageMiddleware.multer().single('picture'),
                        this._imageMiddleware.fileType,
                        this._verifyIdMiddleware,
                    ],
                    tag: 'management',
                    description: desc.profilePicture,
                    fileUpload: true,
                },
            },

            // PUT
            {
                method: 'put',
                path: `${BASE_PATH}/:id/update`,
                parameters: [...generateIDParam()],
                controller: this._usersController.update,
                schema: DomainDataFaker.mocks.updateUserMock,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.update,
                },
            },

            // PATCH
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/question/activate`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(2, [
                        { name: 'token', type: 'string', required: 'off' },
                        { name: 'isUpdate', type: 'boolean', required: 'off' },
                    ]),
                ],
                controller: this._usersController.activateSecretQuestion,
                schema: DomainDataFaker.mocks.activateSecretQuestionMock,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                        this._authorizationMiddleware.secretQuestion,
                        this._authorizationMiddleware.twoFactor,
                    ],
                    tag: 'authorization',
                    description: desc.activateQuestion,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/confirm`,
                parameters: [
                    ...generateQueryParam(2, [
                        { name: 'email', type: 'string' },
                        { name: 'code', type: 'string' },
                    ]),
                ],
                controller: this._usersController.confirmEmail,
                options: {
                    middlewares: [this._verifyEmailCodeMiddleware.verify],
                    tag: 'register',
                    description: desc.confirm,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/activate`,
                parameters: [...generateIDParam()],
                controller: this._usersController.activateTwoFactor,
                schema: DomainDataFaker.mocks.activateSecretQuestionMock,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._verifyIdMiddleware,
                        this._authorizationMiddleware.secretQuestion,
                    ],
                    tag: 'authorization',
                    description: desc.activate2FA,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/reset`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'token', type: 'string' }]),
                ],
                controller: this._usersController.resetTwoFactor,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._verifyIdMiddleware,
                        this._authorizationMiddleware.twoFactor,
                    ],
                    tag: 'authorization',
                    description: desc.reset2FA,
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
                schema: DomainDataFaker.mocks.updateEmailMock,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        this._authorizationMiddleware.twoFactor,
                        this._verifyEmailCodeMiddleware.verify,
                    ],
                    tag: 'management',
                    description: desc.updateEmail,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/update/password`,
                controller: this._usersController.updatePassword,
                schema: DomainDataFaker.mocks.updatePasswordMock,
                parameters: [
                    ...generateQueryParam(2, [
                        { name: 'question', type: 'string', required: 'off' },
                        { name: 'answer', type: 'string', required: 'off' },
                        { name: 'code', type: 'string' },
                        { name: 'email', type: 'string' },
                        { name: 'token', type: 'string', required: 'off' },
                    ]),
                ],
                options: {
                    middlewares: [
                        this._authorizationMiddleware.twoFactor,
                        this._authorizationMiddleware.secretQuestion,
                        this._verifyEmailCodeMiddleware.verify,
                    ],
                    tag: 'management',
                    description: desc.updatePassword,
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
                        passport.authenticate('cookie', { session: false }),
                    ],
                    tag: 'management',
                    description: desc.updateGameInfo,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/reset`,
                controller: this._usersController.resetProfile,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                        this._authorizationMiddleware.twoFactor,
                    ],
                    tag: 'management',
                    description: desc.resetProfile,
                },
            },

            // DELETE
            {
                method: 'delete',
                path: `${BASE_PATH}/:id/delete`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(3, [
                        { name: 'question', type: 'string', required: 'off' },
                        { name: 'answer', type: 'string', required: 'off' },
                        { name: 'token', type: 'string', required: 'off' },
                    ]),
                ],
                controller: this._usersController.delete,
                options: {
                    middlewares: [
                        this._verifyIdMiddleware,
                        passport.authenticate('cookie', { session: false }),
                        this._authorizationMiddleware.secretQuestion,
                        this._authorizationMiddleware.twoFactor,
                    ],
                    tag: 'management',
                    description: desc.deleteProfile,
                },
            },
        ] as unknown as routeInstance[];
    }
}
