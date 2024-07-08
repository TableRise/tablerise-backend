import ArmorsController from 'src/interface/dungeons&dragons5e/presentation/armors/ArmorsController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface ArmorsRoutesContract {
    armorsController: ArmorsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
