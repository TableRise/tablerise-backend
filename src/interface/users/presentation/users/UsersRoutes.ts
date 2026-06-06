import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
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
            { basePath: BASE_PATH },
            // GET
            {
                method: 'get',
                path: '/all',
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
                path: '/me',
                controller: this.usersController.currentUser,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'users',
                    description: desc.currentUser,
                },
            },
            {
                method: 'get',
                path: '/logout',
                controller: this.usersController.logoutUser,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'authentication',
                    description: desc.logoutUser,
                },
            },
            {
                method: 'get',
                path: '/:id',
                controller: this.usersController.getUserById,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'users',
                    description: desc.get,
                },
            },
            {
                method: 'get',
                path: '/:id/campaigns',
                controller: this.usersController.getCampaignsByUserId,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'users',
                    description: desc.getCampaigns,
                },
            },

            // POST
            {
                method: 'post',
                path: '/authenticate/email/send-code',
                controller: this.usersController.verifyEmail,
                options: {
                    schemas: [{ query: this.usersSchemas.postValidateEmailSendCode.query }],
                    tag: 'authentication',
                    description: desc.verify,
                },
            },
            {
                method: 'post',
                path: '/register',
                controller: this.usersController.register,
                options: {
                    schemas: [{ body: this.usersSchemas.postCreateUser.body }],
                    tag: 'register',
                    description: desc.register,
                },
            },
            {
                method: 'post',
                path: '/login',
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
                path: '/:id/support/post',
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
                path: '/:id/donate',
                controller: this.usersController.registerDonation,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    schemas: [
                        {
                            query: this.usersSchemas.postDonate.query,
                            body: this.usersSchemas.postDonate.body,
                        },
                    ],
                    tag: 'management',
                    description: desc.postDonate,
                },
            },
            {
                method: 'post',
                path: '/:id/update/picture',
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
                path: '/authenticate/email',
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
                path: '/authenticate/2fa',
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
                path: '/:id/update',
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
                path: '/:id/update/details',
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
                path: '/:id/2fa/activate',
                controller: this.usersController.activateTwoFactor,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.activate2FA,
                },
            },
            {
                method: 'patch',
                path: '/:id/2fa/deactivate',
                controller: this.usersController.deactivateTwoFactor,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.deactivate2FA,
                },
            },
            {
                method: 'patch',
                path: '/:id/update/cover',
                controller: this.usersController.updateUserCover,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this.imageMiddleware.multer().single('image'),
                        this.imageMiddleware.fileType,
                        this.verifyIdMiddleware,
                    ],
                    schemas: [{ body: this.usersSchemas.patchUpdateUserCover.body }],
                    tag: 'management',
                    description: desc.updateUserCover,
                    fileUpload: true,
                },
            },
            {
                method: 'patch',
                path: '/:id/update/cover/remove',
                controller: this.usersController.removeUserCover,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false }), this.verifyIdMiddleware],
                    tag: 'management',
                    description: desc.removeUserCover,
                },
            },
            {
                method: 'patch',
                path: '/:id/update/email',
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
                path: '/update/password',
                controller: this.usersController.updatePassword,
                options: {
                    schemas: [
                        {
                            query: this.usersSchemas.patchUpdatePassword.query,
                            body: this.usersSchemas.patchUpdatePassword.body,
                        },
                    ],
                    tag: 'management',
                    description: desc.updatePassword,
                },
            },
            {
                method: 'patch',
                path: '/:id/update/campaign/notes',
                controller: this.usersController.updateCampaignNotes,
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
            // DELETE
            {
                method: 'delete',
                path: '/:id/delete',
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
