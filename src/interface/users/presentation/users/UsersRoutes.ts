import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';
import desc from 'src/interface/users/presentation/users/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

const BASE_PATH = '/users';

export default class UsersRoutes {
    private readonly usersController;
    private readonly verifyIdMiddleware;
    private readonly authorizationMiddleware;
    private readonly imageMiddleware;
    private readonly verifyEmailCodeMiddleware;
    private readonly verifyUserMiddleware;
    private readonly loginPassport;
    private readonly authenticatePassport;
    private readonly usersSchemas;

    constructor({
        usersController,
        authorizationMiddleware,
        verifyIdMiddleware,
        imageMiddleware,
        verifyEmailCodeMiddleware,
        verifyUserMiddleware,
        loginPassport,
        authenticatePassport,
        usersSchemas,
    }: InterfaceDependencies['usersRoutesContract']) {
        this.usersController = usersController;
        this.verifyIdMiddleware = verifyIdMiddleware;
        this.imageMiddleware = imageMiddleware;
        this.verifyEmailCodeMiddleware = verifyEmailCodeMiddleware;
        this.authorizationMiddleware = authorizationMiddleware;
        this.verifyUserMiddleware = verifyUserMiddleware;
        this.loginPassport = loginPassport;
        this.authenticatePassport = authenticatePassport;
        this.usersSchemas = usersSchemas;
    }

    public routes(): routeInstance[] {
        this.loginPassport.localStrategy();
        this.authenticatePassport.cookieStrategy();

        return [
            // GET
            {
                method: 'get',
                path: `${BASE_PATH}/all`,
                controller: this.usersController.getUsers,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.authorizationMiddleware.checkAdminRole,
                        this.verifyUserMiddleware.userStatus,
                    ],
                    tag: 'users',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/logout`,
                controller: this.usersController.logoutUser,
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
                controller: this.usersController.getUserById,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'users',
                    description: desc.get,
                },
            },

            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/authenticate/email/send-code`,
                parameters: [
                    ...generateQueryParam(2, [
                        { name: 'email', type: 'string' },
                        { name: 'flow', type: 'string' },
                    ]),
                ],
                controller: this.usersController.verifyEmail,
                options: {
                    tag: 'authentication',
                    description: desc.verify,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/register`,
                controller: this.usersController.register,
                schema: this.usersSchemas.postCreateUser.example,
                options: {
                    tag: 'register',
                    description: desc.register,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/login`,
                controller: this.usersController.login,
                schema: this.usersSchemas.postLogin.example,
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
                controller: this.usersController.profilePicture,
                schema: this.usersSchemas.postUpdateUserProfilePicture.example,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('picture'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                    ],
                    tag: 'management',
                    description: desc.profilePicture,
                    fileUpload: true,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/authenticate/email`,
                parameters: [
                    ...generateQueryParam(3, [
                        { name: 'email', type: 'string' },
                        { name: 'code', type: 'string' },
                        { name: 'flow', type: 'string' },
                    ]),
                ],
                controller: this.usersController.internalAuthentication,
                options: {
                    middlewares: [this.verifyEmailCodeMiddleware.verify],
                    tag: 'authentication',
                    description: desc.emailCode,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/authenticate/2fa`,
                parameters: [
                    ...generateQueryParam(3, [
                        { name: 'email', type: 'string' },
                        { name: 'token', type: 'string' },
                        { name: 'flow', type: 'string' },
                    ]),
                ],
                controller: this.usersController.internalAuthentication,
                options: {
                    middlewares: [this.authorizationMiddleware.twoFactor],
                    tag: 'authentication',
                    description: desc.token2FA,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/authenticate/secret-question`,
                parameters: [
                    ...generateQueryParam(2, [
                        { name: 'email', type: 'string' },
                        { name: 'flow', type: 'string' },
                    ]),
                ],
                schema: this.usersSchemas.postAuthenticateSecretQuestion.example,
                controller: this.usersController.internalAuthentication,
                options: {
                    middlewares: [this.authorizationMiddleware.secretQuestion],
                    tag: 'authentication',
                    description: desc.secretQuestion,
                },
            },

            // PUT
            {
                method: 'put',
                path: `${BASE_PATH}/:id/update`,
                parameters: [...generateIDParam()],
                controller: this.usersController.update,
                schema: this.usersSchemas.putUpdateUser.body,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'management',
                    description: desc.update,
                },
            },

            // PATCH
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/question/activate`,
                parameters: [...generateIDParam()],
                controller: this.usersController.activateSecretQuestion,
                schema: this.usersSchemas.patchActivateSecretQuestion.example,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'management',
                    description: desc.activateQuestion,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/question/update`,
                parameters: [...generateIDParam()],
                controller: this.usersController.updateSecretQuestion,
                schema: this.usersSchemas.patchSecretQuestionUpdate.body,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'management',
                    description: desc.updateSecretQuestion,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/activate`,
                parameters: [...generateIDParam()],
                controller: this.usersController.activateTwoFactor,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.activate2FA,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/2fa/reset`,
                parameters: [...generateIDParam()],
                controller: this.usersController.resetTwoFactor,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.reset2FA,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/email`,
                parameters: [...generateIDParam()],
                controller: this.usersController.updateEmail,
                schema: this.usersSchemas.patchUpdateEmail.body,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'management',
                    description: desc.updateEmail,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/update/password`,
                controller: this.usersController.updatePassword,
                schema: this.usersSchemas.patchUpdatePassword.body,
                parameters: [...generateQueryParam(1, [{ name: 'email', type: 'string' }])],
                options: {
                    tag: 'management',
                    description: desc.updatePassword,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/game-info`,
                controller: this.usersController.updateGameInfo,
                schema: this.usersSchemas.patchUpdateUserGameInfo.body,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.updateGameInfo,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/reset`,
                controller: this.usersController.resetProfile,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'management',
                    description: desc.resetProfile,
                },
            },

            // DELETE
            {
                method: 'delete',
                path: `${BASE_PATH}/:id/delete`,
                parameters: [...generateIDParam()],
                controller: this.usersController.delete,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'management',
                    description: desc.deleteProfile,
                },
            },
        ] as unknown as routeInstance[];
    }
}
