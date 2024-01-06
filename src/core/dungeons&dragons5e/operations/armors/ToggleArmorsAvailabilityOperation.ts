import { Armor } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleArmorsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/armors/ToggleArmorsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleArmorsAvailabilityOperation {
    private readonly _toggleArmorsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleArmorsAvailabilityService,
        logger,
    }: ToggleArmorsAvailabilityOperationContract) {
        this._toggleArmorsAvailabilityService = toggleArmorsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Armor>> {
        this._logger('info', 'Execute - GetArmorOperation');
        const armors = await this._toggleArmorsAvailabilityService.toggle({
            id,
            availability,
        });
        return armors;
    }
}
