import DatabaseManagement from '@tablerise/database-management';
import ErrorMiddleware from 'src/interface/common/middlewares/ErrorMiddleware';
import UsersRoutesMiddleware from 'src/interface/users/middlewares/UsersRoutesMiddleware';
import CampaignsRoutesMiddleware from 'src/interface/campaigns/middlewares/CampaignsRoutesMiddleware';
import swaggerGenerator from 'src/domains/common/helpers/swaggerGenerator';
import { Logger } from '../../Logger';
import DungeonsAndDragonsRoutesMiddleware from 'src/interface/dungeons&dragons5e/middlewares/DungeonsAndDragonsRoutesMiddleware';
import AccessHeadersMiddleware from 'src/interface/common/middlewares/AccessHeadersMiddleware';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRoutesMiddleware from 'src/interface/campaigns/middlewares/CampaignsRoutesMiddleware';

export interface ApplicationContract {
    usersRoutesMiddleware: UsersRoutesMiddleware;
    campaignsRoutesMiddleware: CampaignsRoutesMiddleware;
    dungeonsAndDragonsRoutesMiddleware: DungeonsAndDragonsRoutesMiddleware;
    campaignsRoutesMiddleware: CampaignsRoutesMiddleware;
    swaggerGenerator: typeof swaggerGenerator;
    errorMiddleware: typeof ErrorMiddleware;
    accessHeadersMiddleware: typeof AccessHeadersMiddleware;
    database: DatabaseManagement;
    socketIO: SocketIO;
    logger: Logger;
}
