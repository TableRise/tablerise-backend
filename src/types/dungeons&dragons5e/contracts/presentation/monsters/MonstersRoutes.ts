import MonstersController from 'src/interface/dungeons&dragons5e/presentation/monsters/MonstersController';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

export interface MonstersRoutesContract {
    monstersController: MonstersController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
