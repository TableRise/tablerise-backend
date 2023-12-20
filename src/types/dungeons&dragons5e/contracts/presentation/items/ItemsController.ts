import GetAllItemsOperation from 'src/core/dungeons&dragons5e/operations/items/GetAllItemsOperation';
import GetItemOperation from 'src/core/dungeons&dragons5e/operations/items/GetItemOperation';
import GetDisabledItemsOperation from 'src/core/dungeons&dragons5e/operations/items/GetDisabledItemsOperation';
import ToggleItemsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/items/ToggleItemsAvailabilityOperation';

export interface ItemsControllerContract {
    getAllItemsOperation: GetAllItemsOperation;
    getItemOperation: GetItemOperation;
    getDisabledItemsOperation: GetDisabledItemsOperation;
    toggleItemsAvailabilityOperation: ToggleItemsAvailabilityOperation;
}
