import EquipmentController from 'src/interface/dungeons&dragons5e/presentation/equipment/EquipmentController';
import VerifyIdMiddleware from 'src/interface/common/middlewares/VerifyIdMiddleware';

export interface EquipmentRoutesContract {
    equipmentController: EquipmentController;
    verifyIdMiddleware: typeof VerifyIdMiddleware;
}
