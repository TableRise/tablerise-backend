import GetAllGodsOperation from 'src/core/dungeons&dragons5e/operations/gods/GetAllGodsOperation';
import GetGodOperation from 'src/core/dungeons&dragons5e/operations/gods/GetGodOperation';
import GetDisabledGodsOperation from 'src/core/dungeons&dragons5e/operations/gods/GetDisabledGodsOperation';
import ToggleGodsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/gods/ToggleGodsAvailabilityOperation';

export interface GodsControllerContract {
    getAllGodsOperation: GetAllGodsOperation;
    getGodOperation: GetGodOperation;
    getDisabledGodsOperation: GetDisabledGodsOperation;
    toggleGodsAvailabilityOperation: ToggleGodsAvailabilityOperation;
}
