import GetAllEquipmentOperation from 'src/core/dungeons&dragons5e/operations/equipment/GetAllEquipmentOperation';
import GetDisabledEquipmentOperation from 'src/core/dungeons&dragons5e/operations/equipment/GetDisabledEquipmentOperation';
import GetEquipmentOperation from 'src/core/dungeons&dragons5e/operations/equipment/GetEquipmentOperation';
import ToggleEquipmentAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/equipment/ToggleEquipmentAvailabilityOperation';

export interface EquipmentControllerContract {
    getAllEquipmentOperation: GetAllEquipmentOperation;
    getEquipmentOperation: GetEquipmentOperation;
    getDisabledEquipmentOperation: GetDisabledEquipmentOperation;
    toggleEquipmentAvailabilityOperation: ToggleEquipmentAvailabilityOperation;
}
