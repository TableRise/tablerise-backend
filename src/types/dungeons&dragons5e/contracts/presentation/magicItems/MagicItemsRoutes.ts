import MagicItemsController from 'src/interface/dungeons&dragons5e/presentation/magicItems/MagicItemsController';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

export interface MagicItemsRoutesContract {
    magicItemsController: MagicItemsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
