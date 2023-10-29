import DatabaseManagement from '@tablerise/database-management';
import ErrorMiddleware from 'src/interface/common/middlewares/ErrorMiddleware';
import UsersRoutesMiddleware from 'src/interface/users/middlewares/UsersRoutesMiddleware';
import swaggerGenerator from 'src/infra/helpers/common/swaggerGenerator';
import { Logger } from '../../Logger';

export interface ApplicationContract {
    usersRoutesMiddleware: UsersRoutesMiddleware;
    swaggerGenerator: typeof swaggerGenerator;
    errorMiddleware: typeof ErrorMiddleware;
    database: DatabaseManagement;
    logger: Logger;
}
