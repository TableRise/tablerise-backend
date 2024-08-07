import ItemsController from 'src/interface/dungeons&dragons5e/presentation/items/ItemsController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface ItemsRoutesContract {
    itemsController: ItemsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
