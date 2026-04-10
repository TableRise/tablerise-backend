import { MagicItem } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleMagicItemsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/ToggleMagicItemsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleMagicItemsAvailabilityOperation {
    private readonly toggleMagicItemsAvailabilityService;
    private readonly logger;

    constructor({ toggleMagicItemsAvailabilityService, logger }: ToggleMagicItemsAvailabilityOperationContract) {
        this.toggleMagicItemsAvailabilityService = toggleMagicItemsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<MagicItem>> {
        this.logger('info', 'Execute - GetMagicItemOperation');
        const magicItems = await this.toggleMagicItemsAvailabilityService.toggle({
            id,
            availability,
        });
        return magicItems;
    }
}
