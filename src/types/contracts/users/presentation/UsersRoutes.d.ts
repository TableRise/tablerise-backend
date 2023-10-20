import { VerifyIdMiddleware } from 'src/middlewares/VerifyIdMiddleware';
import UsersController from 'src/interface/users/presentation/UsersController';

export abstract class UsersRoutesContract {
    usersController: UsersController;
    verifyIdMiddleware: VerifyIdMiddleware;
}
