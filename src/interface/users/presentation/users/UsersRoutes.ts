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
            {
                method: 'get',
                path: `${BASE_PATH}/:id/campaigns`,
                controller: this.usersController.getCampaignsByUserId,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'users',
                    description: desc.getCampaigns,
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
                    schemas: [{ query: this.usersSchemas.postValidateEmailSendCode.query }],
                    tag: 'authentication',
                    description: desc.verify,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/register`,
                controller: this.usersController.register,
                options: {
                    schemas: [{ body: this.usersSchemas.postCreateUser.body }],
                    tag: 'register',
                    description: desc.register,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/login`,
                controller: this.usersController.login,
                options: {
                    middlewares: [passport.authenticate('local', { session: false })],
                    schemas: [{ body: this.usersSchemas.postLogin.body }],
                    tag: 'authentication',
                    description: desc.login,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/support/post`,
                parameters: [...generateIDParam()],
                controller: this.usersController.postSupportEmail,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.usersSchemas.postSupportEmail.body }],
                    tag: 'management',
                    description: desc.postSupportEmail,
                },
            },
            {
                method: 'post',
                path: `${BASE_PATH}/:id/update/picture`,
                parameters: [...generateIDParam()],
                controller: this.usersController.profilePicture,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('picture'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                    ],
                    schemas: [{ body: this.usersSchemas.postUpdateUserProfilePicture.body }],
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
                    schemas: [{ query: this.usersSchemas.postAuthenticateEmail.query }],
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
                    schemas: [{ query: this.usersSchemas.postAuthenticate2FA.query }],
                    tag: 'authentication',
                    description: desc.token2FA,
                },
            },

            // PUT
            {
                method: 'put',
                path: `${BASE_PATH}/:id/update`,
                parameters: [...generateIDParam()],
                controller: this.usersController.updateUser,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ body: this.usersSchemas.putUpdateUser.body }],
                    tag: 'management',
                    description: desc.update,
                },
            },
            {
                method: 'put',
                path: `${BASE_PATH}/:id/update/details`,
                parameters: [...generateIDParam()],
                controller: this.usersController.updateUserDetails,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ body: this.usersSchemas.putUpdateUserDetails.body }],
                    tag: 'management',
                    description: desc.updateDetails,
                },
            },

            // PATCH
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
                path: `${BASE_PATH}/:id/2fa/deactivate`,
                parameters: [...generateIDParam()],
                controller: this.usersController.deactivateTwoFactor,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.deactivate2FA,
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
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    schemas: [{ body: this.usersSchemas.patchUpdateEmail.body }],
                    tag: 'management',
                    description: desc.updateEmail,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/update/password`,
                controller: this.usersController.updatePassword,
                parameters: [...generateQueryParam(1, [{ name: 'email', type: 'string' }])],
                options: {
                    schemas: [{ body: this.usersSchemas.patchUpdatePassword.body }],
                    tag: 'management',
                    description: desc.updatePassword,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/game-info/add`,
                controller: this.usersController.addGameInfo,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.usersSchemas.patchAddUserGameInfo.body }],
                    tag: 'management',
                    description: desc.addGameInfo,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/game-info/remove`,
                controller: this.usersController.removeGameInfo,
                parameters: [...generateIDParam()],
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [{ body: this.usersSchemas.patchRemoveUserGameInfo.body }],
                    tag: 'management',
                    description: desc.removeGameInfo,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/campaign/notes`,
                controller: this.usersController.updateCampaignNotes,
                parameters: [...generateIDParam(), ...generateQueryParam(1, [{ name: 'campaignId', type: 'string' }])],
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [
                        { query: this.usersSchemas.patchUpdateCampaignNotes.query },
                        { body: this.usersSchemas.patchUpdateCampaignNotes.body },
                    ],
                    tag: 'management',
                    description: desc.updateCampaignNotes,
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
        ] as routeInstance[];
    }
}
