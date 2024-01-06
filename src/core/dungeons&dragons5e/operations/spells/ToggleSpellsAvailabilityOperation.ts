import { Spell } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleSpellsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/spells/ToggleSpellsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

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
