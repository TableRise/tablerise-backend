import DatabaseManagement from '@tablerise/database-management';
import ErrorMiddleware from 'src/interface/common/middlewares/ErrorMiddleware';
import { Logger } from '../../Logger';
import SocketIO from 'src/infra/clients/SocketIO';
import UsersRoutes from 'src/interface/users/presentation/users/UsersRoutes';
import OAuthRoutes from 'src/interface/users/presentation/oauth/OAuthRoutes';
import CampaignsRoutes from 'src/interface/campaigns/presentation/campaigns/CampaignsRoutes';
import CharactersRoutes from 'src/interface/characters/presentation/character/CharactersRoutes';
import BackgroundsRoutes from 'src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsRoutes';
import ClassesRoutes from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesRoutes';
import EquipmentRoutes from 'src/interface/dungeons&dragons5e/presentation/equipment/EquipmentRoutes';
import FeatsRoutes from 'src/interface/dungeons&dragons5e/presentation/feats/FeatsRoutes';
import RacesRoutes from 'src/interface/dungeons&dragons5e/presentation/races/RacesRoutes';
import SpellsRoutes from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsRoutes';
import VerifyUserMiddleware from 'src/interface/common/middlewares/VerifyUserMiddleware';

export interface ApplicationContract {
    usersRoutes: UsersRoutes;
    oAuthRoutes: OAuthRoutes;
    campaignsRoutes: CampaignsRoutes;
    charactersRoutes: CharactersRoutes;
    backgroundsRoutes: BackgroundsRoutes;
    classesRoutes: ClassesRoutes;
    equipmentRoutes: EquipmentRoutes;
    featsRoutes: FeatsRoutes;
    racesRoutes: RacesRoutes;
    spellsRoutes: SpellsRoutes;
    verifyUserMiddleware: VerifyUserMiddleware;
    errorMiddleware: typeof ErrorMiddleware;
    database: DatabaseManagement;
    socketIO: SocketIO;
    logger: Logger;
}
