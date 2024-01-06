import GetAllWikisOperation from 'src/core/dungeons&dragons5e/operations/wikis/GetAllWikisOperation';
import GetDisabledWikisOperation from 'src/core/dungeons&dragons5e/operations/wikis/GetDisabledWikisOperation';
import GetWikiOperation from 'src/core/dungeons&dragons5e/operations/wikis/GetWikiOperation';
import ToggleWikisAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/wikis/ToggleWikisAvailabilityOperation';

export interface WikisControllerContract {
    getAllWikisOperation: GetAllWikisOperation;
    getWikiOperation: GetWikiOperation;
    getDisabledWikisOperation: GetDisabledWikisOperation;
    toggleWikisAvailabilityOperation: ToggleWikisAvailabilityOperation;
}
