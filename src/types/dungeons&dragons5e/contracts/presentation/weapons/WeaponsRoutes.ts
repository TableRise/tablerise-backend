import VerifyBooleanQueryMiddleware from 'src/interface/common/middlewares/VerifyBooleanQueryMiddleware';
import WeaponsController from 'src/interface/dungeons&dragons5e/presentation/weapons/WeaponsController';
import VerifyIdMiddleware from 'src/interface/users/middlewares/VerifyIdMiddleware';

export interface WeaponsRoutesContract {
    weaponsController: WeaponsController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
    verifyBooleanQueryMiddleware: typeof VerifyBooleanQueryMiddleware;
}
