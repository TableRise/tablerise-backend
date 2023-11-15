import GetAllMagicItemsOperation from 'src/core/dungeons&dragons5e/operations/magicItems/GetAllMagicItemsOperation';
import GetMagicItemOperation from 'src/core/dungeons&dragons5e/operations/magicItems/GetMagicItemOperation';
import GetDisabledMagicItemsOperation from 'src/core/dungeons&dragons5e/operations/magicItems/GetDisabledMagicItemsOperation';
import ToggleMagicItemsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/magicItems/ToggleMagicItemsAvailabilityOperation';

export interface MagicItemsControllerContract {
    getAllMagicItemsOperation: GetAllMagicItemsOperation;
    getMagicItemOperation: GetMagicItemOperation;
    getDisabledMagicItemsOperation: GetDisabledMagicItemsOperation;
    toggleMagicItemsAvailabilityOperation: ToggleMagicItemsAvailabilityOperation;
}
