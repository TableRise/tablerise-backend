import { Wiki } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleWikisAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/ToggleWikisAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleWikisAvailabilityOperation {
    private readonly _toggleWikisAvailabilityService;
    private readonly _logger;

    constructor({
        toggleWikisAvailabilityService,
        logger,
    }: ToggleWikisAvailabilityOperationContract) {
        this._toggleWikisAvailabilityService = toggleWikisAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Wiki>> {
        this._logger('info', 'Execute - ToggleWikisAvailabilityOperation');
        const wikis = await this._toggleWikisAvailabilityService.toggle({
            id,
            availability,
        });
        return wikis;
    }
}
