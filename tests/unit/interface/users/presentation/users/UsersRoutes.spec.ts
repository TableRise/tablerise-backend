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
            postDonate: { query: {}, body: {} },
            postMessage: { body: {} },
            postUpdateUserProfilePicture: { example: {} },
            postValidateEmailSendCode: { query: {} },
            postAuthenticateEmail: { query: {} },
            postAuthenticate2FA: { query: {} },
            putUpdateUser: { body: {} },
            putUpdateUserDetails: { body: {} },
            patchUpdateEmail: { example: {} },
            patchUpdateUserCover: { body: {} },
            patchUpdatePassword: { example: {} },
            patchUpdateCampaignNotes: { query: {}, body: {} },
            patchAcceptFriend: { query: {} },
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
            expect(routes).to.have.lengthOf(37);
            expect(routes.find((route) => route.path === '/:id/support/post')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/donate')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/me')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/message')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/messages')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/messages/:messageId')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/messages/:messageId/mark')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/gallery')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/gallery/:imageId')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/friends')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/friends/:targetUserId')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/friends/accept/:targetUserId')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/friends/remove/:targetUserId')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/update/cover')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/update/cover/remove')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/message')?.options?.schemas?.[0]).to.be.deep.equal({
                body: usersSchemas.postMessage.body,
            });
            expect(routes.find((route) => route.path === '/:id/update')?.options?.schemas?.[0]).to.be.deep.equal({
                body: usersSchemas.putUpdateUser.body,
            });
            expect(
                routes.find((route) => route.path === '/:id/update/details')?.options?.schemas?.[0]
            ).to.be.deep.equal({
                body: usersSchemas.putUpdateUserDetails.body,
            });
            expect(routes.find((route) => route.path === '/:id/update/cover')?.options?.schemas?.[0]).to.be.deep.equal({
                body: usersSchemas.patchUpdateUserCover.body,
            });
            expect(
                routes.find((route) => route.path === '/:id/friends/accept/:targetUserId')?.options?.schemas?.[0]
            ).to.be.deep.equal({
                query: usersSchemas.patchAcceptFriend.query,
            });
            expect(routes.find((route) => route.path === '/:id/update/cover')?.options?.fileUpload).to.equal(true);
            expect(routes.find((route) => route.path === '/:id/2fa/deactivate')).to.be.not.undefined();
            expect(routes.find((route) => route.path === '/:id/2fa/reset')).to.be.undefined();
            expect(routes.find((route) => route.path === '/:id/update/game-info/add')).to.be.undefined();
            expect(routes.find((route) => route.path === '/:id/update/game-info/remove')).to.be.undefined();
            expect(routes.find((route) => route.path === '/:id/reset')).to.be.undefined();
            expect(routes.find((route) => route.path === '/authenticate/secret-question')).to.be.undefined();
            expect(routes.find((route) => route.path === '/:id/question/activate')).to.be.undefined();
            expect(routes.find((route) => route.path === '/:id/question/update')).to.be.undefined();
        });
    });
});
