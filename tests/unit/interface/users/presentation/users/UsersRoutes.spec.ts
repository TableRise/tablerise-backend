import UsersRoutes from 'src/interface/users/presentation/users/UsersRoutes';

describe('Interface :: Users :: Presentation :: Users :: UsersRoutes', () => {
    let usersRoutes: UsersRoutes,
        usersController: any,
        verifyIdMiddleware: any,
        authorizationMiddleware: any,
        verifyEmailCodeMiddleware: any,
        verifyUserMiddleware: any,
        imageMiddleware: any;

    context('When all the routes are correctly implemented', () => {
        usersController = {};
        verifyIdMiddleware = () => ({});
        authorizationMiddleware = {};
        verifyEmailCodeMiddleware = {};
        verifyUserMiddleware = {};
        imageMiddleware = { multer: () => ({ single: () => {} }) };

        usersRoutes = new UsersRoutes({
            usersController,
            authorizationMiddleware,
            verifyIdMiddleware,
            verifyEmailCodeMiddleware,
            verifyUserMiddleware,
            imageMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = usersRoutes.routes();
            expect(routes).to.have.lengthOf(18);
        });
    });
});
