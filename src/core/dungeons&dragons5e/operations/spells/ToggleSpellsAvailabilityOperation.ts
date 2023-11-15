import { Spell } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleSpellsAvailabilityOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/spells/ToggleSpellsAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleSpellsAvailabilityOperation {
    private readonly _toggleSpellsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleSpellsAvailabilityService,
        logger,
    }: ToggleSpellsAvailabilityOperationContract) {
        this._toggleSpellsAvailabilityService = toggleSpellsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Spell>> {
        this._logger('info', 'Execute - ToggleSpellsAvailabilityOperation');
        const spells = await this._toggleSpellsAvailabilityService.toggle({
            id,
            availability,
        });

        return spells;
    }
}
