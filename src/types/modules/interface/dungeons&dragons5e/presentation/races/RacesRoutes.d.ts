import RacesController from 'src/interface/dungeons&dragons5e/presentation/races/RacesController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface RacesRoutesContract {
    racesController: RacesController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
