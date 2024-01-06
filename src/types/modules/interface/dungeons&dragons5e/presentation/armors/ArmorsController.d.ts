import GetAllArmorsOperation from 'src/core/dungeons&dragons5e/operations/armors/GetAllArmorsOperation';
import GetArmorOperation from 'src/core/dungeons&dragons5e/operations/armors/GetArmorOperation';
import GetDisabledArmorsOperation from 'src/core/dungeons&dragons5e/operations/armors/GetDisabledArmorsOperation';
import ToggleArmorsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/armors/ToggleArmorsAvailabilityOperation';

export interface ArmorsControllerContract {
    getAllArmorsOperation: GetAllArmorsOperation;
    getArmorOperation: GetArmorOperation;
    getDisabledArmorsOperation: GetDisabledArmorsOperation;
    toggleArmorsAvailabilityOperation: ToggleArmorsAvailabilityOperation;
}
