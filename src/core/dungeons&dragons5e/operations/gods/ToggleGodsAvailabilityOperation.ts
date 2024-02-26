import { God } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleGodsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/gods/ToggleGodsAvailabilityOperation';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleGodsAvailabilityOperation {
    private readonly _toggleGodsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleGodsAvailabilityService,
        logger,
    }: ToggleGodsAvailabilityOperationContract) {
        this._toggleGodsAvailabilityService = toggleGodsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<God>> {
        this._logger('info', 'Execute - GetGodOperation');
        const gods = await this._toggleGodsAvailabilityService.toggle({
            id,
            availability,
        });
        return gods;
    }
}
