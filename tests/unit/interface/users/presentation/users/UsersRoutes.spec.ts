import UsersRoutes from 'src/interface/users/presentation/users/UsersRoutes';

describe('Interface :: Users :: Presentation :: Users :: UsersRoutes', () => {
    let usersRoutes: UsersRoutes,
        usersController: any,
        verifyIdMiddleware: any,
        authorizationMiddleware: any,
        verifyEmailCodeMiddleware: any,
        imageMiddleware: any;

    context('When all the routes are correctly implemented', () => {
        usersController = {};
        verifyIdMiddleware = () => ({});
        authorizationMiddleware = {};
        verifyEmailCodeMiddleware = {};
        imageMiddleware = { multer: () => ({ single: () => {} }) };

        usersRoutes = new UsersRoutes({
            usersController,
            authorizationMiddleware,
            verifyIdMiddleware,
            verifyEmailCodeMiddleware,
            imageMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = usersRoutes.routes();
            expect(routes).to.have.lengthOf(16);
        });
    });
});
