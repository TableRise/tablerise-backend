import RealmsController from 'src/interface/dungeons&dragons5e/presentation/realms/RealmsController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface RealmsRoutesContract {
    realmsController: RealmsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
