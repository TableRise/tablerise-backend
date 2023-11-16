import VerifyBooleanQueryMiddleware from 'src/interface/common/middlewares/VerifyBooleanQueryMiddleware';
import GodsController from 'src/interface/dungeons&dragons5e/presentation/gods/GodsController';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

export interface GodsRoutesContract {
    godsController: GodsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    verifyBooleanQueryMiddleware: typeof VerifyBooleanQueryMiddleware;
}
