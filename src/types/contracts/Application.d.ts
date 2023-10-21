import { ErrorMiddleware } from 'src/interface/common/middlewares/ErrorMiddleware';
import UsersRoutesMiddleware from 'src/interface/users/middlewares/UsersRoutesMiddleware';
import { Logger } from '../Logger';
import DatabaseManagement from '@tablerise/database-management';

export abstract class ApplicationContract {
    usersRoutesMiddleware: UsersRoutesMiddleware;
    errorMiddleware: ErrorMiddleware;
    database: DatabaseManagement;
    logger: Logger;
}
