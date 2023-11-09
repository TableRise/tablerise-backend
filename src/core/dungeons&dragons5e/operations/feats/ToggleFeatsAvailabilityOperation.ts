import { Feat } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleFeatsAvailabilityOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/feats/ToggleFeatsAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleFeatsAvailabilityOperation {
    private readonly _toggleFeatsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleFeatsAvailabilityService,
        logger,
    }: ToggleFeatsAvailabilityOperationContract) {
        this._toggleFeatsAvailabilityService = toggleFeatsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Feat>> {
        this._logger('info', 'Execute - GetFeatOperation');
        const feats = await this._toggleFeatsAvailabilityService.toggle({
            id,
            availability,
        });
        return feats;
    }
}
