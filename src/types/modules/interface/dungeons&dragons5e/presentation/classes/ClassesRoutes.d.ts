import ClassesController from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface ClassesRoutesContract {
    classesController: ClassesController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
