import { MagicItem } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleMagicItemsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/ToggleMagicItemsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleMagicItemsAvailabilityOperation {
    private readonly _toggleMagicItemsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleMagicItemsAvailabilityService,
        logger,
    }: ToggleMagicItemsAvailabilityOperationContract) {
        this._toggleMagicItemsAvailabilityService = toggleMagicItemsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<MagicItem>> {
        this._logger('info', 'Execute - GetMagicItemOperation');
        const magicItems = await this._toggleMagicItemsAvailabilityService.toggle({
            id,
            availability,
        });
        return magicItems;
    }
}
