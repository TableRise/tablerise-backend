import GetAllWeaponsOperation from 'src/core/dungeons&dragons5e/operations/weapons/GetAllWeaponsOperation';
import GetDisabledWeaponsOperation from 'src/core/dungeons&dragons5e/operations/weapons/GetDisabledWeaponsOperation';
import GetWeaponOperation from 'src/core/dungeons&dragons5e/operations/weapons/GetWeaponOperation';
import ToggleWeaponsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/weapons/ToggleWeaponsAvailabilityOperation';

export interface WeaponsControllerContract {
    getAllWeaponsOperation: GetAllWeaponsOperation;
    getWeaponOperation: GetWeaponOperation;
    getDisabledWeaponsOperation: GetDisabledWeaponsOperation;
    toggleWeaponsAvailabilityOperation: ToggleWeaponsAvailabilityOperation;
}
