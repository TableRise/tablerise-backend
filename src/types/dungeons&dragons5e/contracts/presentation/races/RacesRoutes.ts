import VerifyBooleanQueryMiddleware from 'src/interface/common/middlewares/VerifyBooleanQueryMiddleware';
import RacesController from 'src/interface/dungeons&dragons5e/presentation/races/RacesController';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

export interface RacesRoutesContract {
    racesController: RacesController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    verifyBooleanQueryMiddleware: typeof VerifyBooleanQueryMiddleware;
}
