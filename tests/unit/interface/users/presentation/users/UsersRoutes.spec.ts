import UsersRoutes from 'src/interface/users/presentation/users/UsersRoutes';

describe('Interface :: Users :: Presentation :: Users :: UsersRoutes', () => {
    let usersRoutes: UsersRoutes,
        usersController: any,
        usersSchemas: any,
        verifyIdMiddleware: any,
        authorizationMiddleware: any,
        verifyEmailCodeMiddleware: any,
        verifyUserMiddleware: any,
        imageMiddleware: any,
        loginPassport: any,
        authenticatePassport: any;

    context('When all the routes are correctly implemented', () => {
        usersController = {};
        usersSchemas = {
            postCreateUser: { example: {} },
            postLogin: { example: {} },
            postSupportEmail: { body: {} },
            postUpdateUserProfilePicture: { example: {} },
            postValidateEmailSendCode: { query: {} },
            postAuthenticateEmail: { query: {} },
            postAuthenticate2FA: { query: {} },
            putUpdateUser: { body: {} },
            putUpdateUserDetails: { body: {} },
            patchUpdateEmail: { example: {} },
            patchUpdatePassword: { example: {} },
            patchAddUserGameInfo: { example: {} },
            patchRemoveUserGameInfo: { example: {} },
            patchUpdateCampaignNotes: { query: {}, body: {} },
        };
        verifyIdMiddleware = () => ({});
        authorizationMiddleware = {};
        verifyEmailCodeMiddleware = {};
        verifyUserMiddleware = {};
        imageMiddleware = { multer: () => ({ single: () => {} }) };
        loginPassport = { localStrategy: () => {} };
        authenticatePassport = { cookieStrategy: () => {} };

        usersRoutes = new UsersRoutes({
            usersController,
            authorizationMiddleware,
            verifyIdMiddleware,
            verifyEmailCodeMiddleware,
            verifyUserMiddleware,
            imageMiddleware,
            loginPassport,
            authenticatePassport,
            usersSchemas,
        });

        it('Should return the correct number of routes', () => {
            const routes = usersRoutes.routes();
            expect(routes).to.have.lengthOf(23);
            expect(routes.find((route) => route.path === '/users/:id/support/post')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/users/:id/update')?.options?.schemas?.[0]).to.be.deep.equal({
                body: usersSchemas.putUpdateUser.body,
            });
            expect(
                routes.find((route) => route.path === '/users/:id/update/details')?.options?.schemas?.[0]
            ).to.be.deep.equal({
                body: usersSchemas.putUpdateUserDetails.body,
            });
            expect(routes.find((route) => route.path === '/users/:id/2fa/deactivate')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/users/authenticate/secret-question')).to.be.undefined();
            expect(routes.find((route) => route.path === '/users/:id/question/activate')).to.be.undefined();
            expect(routes.find((route) => route.path === '/users/:id/question/update')).to.be.undefined();
        });
    });
});
