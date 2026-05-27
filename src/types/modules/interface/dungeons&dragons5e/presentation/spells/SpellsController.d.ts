import GetAllSpellsOperation from 'src/core/dungeons&dragons5e/operations/spells/GetAllSpellsOperation';
import GetByLevelOperation from 'src/core/dungeons&dragons5e/operations/spells/GetByLevelOperation';
import GetDisabledSpellsOperation from 'src/core/dungeons&dragons5e/operations/spells/GetDisabledSpellsOperation';
import GetSpellOperation from 'src/core/dungeons&dragons5e/operations/spells/GetSpellOperation';
import ToggleSpellsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/spells/ToggleSpellsAvailabilityOperation';

export interface SpellsControllerContract {
    getAllSpellsOperation: GetAllSpellsOperation;
    getSpellOperation: GetSpellOperation;
    getDisabledSpellsOperation: GetDisabledSpellsOperation;
    getByLevelOperation: GetByLevelOperation;
    toggleSpellsAvailabilityOperation: ToggleSpellsAvailabilityOperation;
}
