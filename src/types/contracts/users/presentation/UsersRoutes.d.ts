import { VerifyIdMiddleware } from 'src/middlewares/VerifyIdMiddleware';
import UsersController from 'src/interface/users/presentation/UsersController';
import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';

export abstract class UsersRoutesContract {
    usersController: UsersController;
    verifyIdMiddleware: VerifyIdMiddleware;
    authorizationMiddleware: AuthorizationMiddleware;
}
