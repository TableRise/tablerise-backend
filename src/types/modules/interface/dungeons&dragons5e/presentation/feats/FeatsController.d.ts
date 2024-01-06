import GetAllFeatsOperation from 'src/core/dungeons&dragons5e/operations/feats/GetAllFeatsOperation';
import GetFeatOperation from 'src/core/dungeons&dragons5e/operations/feats/GetFeatOperation';
import GetDisabledFeatsOperation from 'src/core/dungeons&dragons5e/operations/feats/GetDisabledFeatsOperation';
import ToggleFeatsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/feats/ToggleFeatsAvailabilityOperation';

export interface FeatsControllerContract {
    getAllFeatsOperation: GetAllFeatsOperation;
    getFeatOperation: GetFeatOperation;
    getDisabledFeatsOperation: GetDisabledFeatsOperation;
    toggleFeatsAvailabilityOperation: ToggleFeatsAvailabilityOperation;
}
