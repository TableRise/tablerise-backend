import GetAllRealmsOperation from 'src/core/dungeons&dragons5e/operations/realms/GetAllRealmsOperation';
import GetDisabledRealmsOperation from 'src/core/dungeons&dragons5e/operations/realms/GetDisabledRealmsOperation';
import GetRealmOperation from 'src/core/dungeons&dragons5e/operations/realms/GetRealmOperation';
import ToggleRealmsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/realms/ToggleRealmsAvailabilityOperation';

export interface RealmsControllerContract {
    getAllRealmsOperation: GetAllRealmsOperation;
    getRealmOperation: GetRealmOperation;
    getDisabledRealmsOperation: GetDisabledRealmsOperation;
    toggleRealmsAvailabilityOperation: ToggleRealmsAvailabilityOperation;
}
