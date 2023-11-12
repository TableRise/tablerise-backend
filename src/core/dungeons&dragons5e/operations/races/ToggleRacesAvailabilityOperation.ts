import { Race } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleRacesAvailabilityOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/races/ToggleRacesAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

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

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Race>> {
        this._logger('info', 'Execute - ToggleRacesAvailabilityOperation');
        const races = await this._toggleRacesAvailabilityService.toggle({
            id,
            availability,
        });

        return races;
    }
}
