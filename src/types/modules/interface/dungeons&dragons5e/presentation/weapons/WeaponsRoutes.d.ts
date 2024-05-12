import WeaponsController from 'src/interface/dungeons&dragons5e/presentation/weapons/WeaponsController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface WeaponsRoutesContract {
    weaponsController: WeaponsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
