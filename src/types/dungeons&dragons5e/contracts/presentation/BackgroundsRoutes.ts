import VerifyBooleanQueryMiddleware from 'src/interface/common/middlewares/VerifyBooleanQueryMiddleware';
import BackgroundsController from 'src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsController';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

export interface BackgroundsRoutesContract {
    backgroundsController: BackgroundsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    verifyBooleanQueryMiddleware: typeof VerifyBooleanQueryMiddleware;
}
