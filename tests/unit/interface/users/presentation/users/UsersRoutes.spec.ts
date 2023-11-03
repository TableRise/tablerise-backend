import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';
import VerifyEmailCodeMiddleware from 'src/interface/users/middlewares/VerifyEmailCodeMiddleware';
import UsersController from 'src/interface/users/presentation/users/UsersController';
import UsersRoutes from 'src/interface/users/presentation/users/UsersRoutes';

describe('Interface :: Users :: Presentation :: Users :: UsersRoutes', () => {
    let usersRoutes: UsersRoutes,
        usersController,
        verifyIdMiddleware,
        authorizationMiddleware,
        verifyEmailCodeMiddleware;

    context('When all the routes are correctly implemented', () => {
        usersController = {} as UsersController;
        verifyIdMiddleware = () => ({});
        authorizationMiddleware = {} as AuthorizationMiddleware;
        verifyEmailCodeMiddleware = {} as VerifyEmailCodeMiddleware;

        usersRoutes = new UsersRoutes({
            usersController,
            authorizationMiddleware,
            verifyIdMiddleware,
            verifyEmailCodeMiddleware,
        });

        it('Should return the correct number of routes', () => {
            const routes = usersRoutes.routes();
            expect(routes).to.have.lengthOf(13);
        });
    });
});
