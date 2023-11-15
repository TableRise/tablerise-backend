import GetAllMonstersOperation from 'src/core/dungeons&dragons5e/operations/monsters/GetAllMonstersOperation';
import GetMonsterOperation from 'src/core/dungeons&dragons5e/operations/monsters/GetMonsterOperation';
import GetDisabledMonstersOperation from 'src/core/dungeons&dragons5e/operations/monsters/GetDisabledMonstersOperation';
import ToggleMonstersAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/monsters/ToggleMonstersAvailabilityOperation';

export interface MonstersControllerContract {
    getAllMonstersOperation: GetAllMonstersOperation;
    getMonsterOperation: GetMonsterOperation;
    getDisabledMonstersOperation: GetDisabledMonstersOperation;
    toggleMonstersAvailabilityOperation: ToggleMonstersAvailabilityOperation;
}
