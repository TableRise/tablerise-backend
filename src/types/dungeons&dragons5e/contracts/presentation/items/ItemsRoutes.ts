import VerifyBooleanQueryMiddleware from 'src/interface/common/middlewares/VerifyBooleanQueryMiddleware';
import ItemsController from 'src/interface/dungeons&dragons5e/presentation/items/ItemsController';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

export interface ItemsRoutesContract {
    itemsController: ItemsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    verifyBooleanQueryMiddleware: typeof VerifyBooleanQueryMiddleware;
}
