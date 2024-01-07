import DatabaseManagement from '@tablerise/database-management';
import ErrorMiddleware from 'src/interface/common/middlewares/ErrorMiddleware';
import UsersRoutesMiddleware from 'src/interface/users/middlewares/UsersRoutesMiddleware';
import swaggerGenerator from 'src/domains/common/helpers/swaggerGenerator';
import { Logger } from '../../Logger';
import DungeonsAndDragonsRoutesMiddleware from 'src/interface/dungeons&dragons5e/middlewares/DungeonsAndDragonsRoutesMiddleware';
import AccessHeadersMiddleware from 'src/interface/common/middlewares/AccessHeadersMiddleware';
import SocketIO from 'src/infra/connection/SocketIO';

export interface ApplicationContract {
    usersRoutesMiddleware: UsersRoutesMiddleware;
    dungeonsAndDragonsRoutesMiddleware: DungeonsAndDragonsRoutesMiddleware;
    swaggerGenerator: typeof swaggerGenerator;
    errorMiddleware: typeof ErrorMiddleware;
    accessHeadersMiddleware: typeof AccessHeadersMiddleware;
    database: DatabaseManagement;
    socketIO: SocketIO;
    logger: Logger;
}
