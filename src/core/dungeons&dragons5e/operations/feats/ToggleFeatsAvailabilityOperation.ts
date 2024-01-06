import { Feat } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleFeatsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/feats/ToggleFeatsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

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
