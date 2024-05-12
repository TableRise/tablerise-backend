import FeatsController from 'src/interface/dungeons&dragons5e/presentation/feats/FeatsController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface FeatsRoutesContract {
    featsController: FeatsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
