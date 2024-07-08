import WikisController from 'src/interface/dungeons&dragons5e/presentation/wikis/WikisController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface WikisRoutesContract {
    wikisController: WikisController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
