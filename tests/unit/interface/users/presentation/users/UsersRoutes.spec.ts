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
            postUpdateUserProfilePicture: { example: {} },
            postAuthenticateSecretQuestion: { example: {} },
            putUpdateUser: { example: {} },
            patchActivateSecretQuestion: { example: {} },
            patchSecretQuestionUpdate: { example: {} },
            patchUpdateEmail: { example: {} },
            patchUpdatePassword: { example: {} },
            patchUpdateUserGameInfo: { example: {} },
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
            expect(routes).to.have.lengthOf(20);
        });
    });
});
