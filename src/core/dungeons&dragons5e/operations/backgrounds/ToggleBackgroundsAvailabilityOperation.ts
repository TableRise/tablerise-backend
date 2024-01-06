import { Background } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleBackgroundsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/ToggleBackgroundsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleBackgroundsAvailabilityOperation {
    private readonly _toggleBackgroundsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleBackgroundsAvailabilityService,
        logger,
    }: ToggleBackgroundsAvailabilityOperationContract) {
        this._toggleBackgroundsAvailabilityService = toggleBackgroundsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Background>> {
        this._logger('info', 'Execute - GetBackgroundOperation');
        const backgrounds = await this._toggleBackgroundsAvailabilityService.toggle({
            id,
            availability,
        });
        return backgrounds;
    }
}
