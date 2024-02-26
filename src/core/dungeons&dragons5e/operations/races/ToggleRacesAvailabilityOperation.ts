import { Race } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleRacesAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/races/ToggleRacesAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleRacesAvailabilityOperation {
    private readonly _toggleRacesAvailabilityService;
    private readonly _logger;

    constructor({
        toggleRacesAvailabilityService,
        logger,
    }: ToggleRacesAvailabilityOperationContract) {
        this._toggleRacesAvailabilityService = toggleRacesAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Race>> {
        this._logger('info', 'Execute - ToggleRacesAvailabilityOperation');
        const races = await this._toggleRacesAvailabilityService.toggle({
            id,
            availability,
        });

        return races;
    }
}
