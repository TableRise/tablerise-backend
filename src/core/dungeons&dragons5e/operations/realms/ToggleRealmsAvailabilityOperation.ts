import { Realm } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleRealmsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/realms/ToggleRealmsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleRealmsAvailabilityOperation {
    private readonly _toggleRealmsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleRealmsAvailabilityService,
        logger,
    }: ToggleRealmsAvailabilityOperationContract) {
        this._toggleRealmsAvailabilityService = toggleRealmsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Realm>> {
        this._logger('info', 'Execute - ToggleRealmsAvailabilityOperation');
        const realms = await this._toggleRealmsAvailabilityService.toggle({
            id,
            availability,
        });

        return realms;
    }
}
