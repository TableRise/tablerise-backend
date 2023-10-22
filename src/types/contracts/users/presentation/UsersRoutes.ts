import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';
import UsersController from 'src/interface/users/presentation/UsersController';
import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';

export interface UsersRoutesContract {
    usersController: UsersController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
}
