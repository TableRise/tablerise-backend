import GetAllBackgroundsOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetAllBackgroundsOperation';
import GetBackgroundOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetBackgroundOperation';
import GetDisabledBackgroundsOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetDisabledBackgroundsOperation';
import ToggleBackgroundsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/ToggleBackgroundsAvailabilityOperation';

export interface BackgroundsControllerContract {
    getAllBackgroundsOperation: GetAllBackgroundsOperation;
    getBackgroundOperation: GetBackgroundOperation;
    getDisabledBackgroundsOperation: GetDisabledBackgroundsOperation;
    toggleBackgroundsAvailabilityOperation: ToggleBackgroundsAvailabilityOperation;
}
