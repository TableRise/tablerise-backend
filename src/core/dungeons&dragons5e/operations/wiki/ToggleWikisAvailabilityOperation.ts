import { Wiki } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleWikisAvailabilityOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/wikis/ToggleWikisAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

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
        this._logger('info', 'Execute - GetWikiOperation');
        const wikis = await this._toggleWikisAvailabilityService.toggle({
            id,
            availability,
        });
        return wikis;
    }
}
