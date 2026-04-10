import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleSpellsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/spells/ToggleSpellsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleSpellsAvailabilityOperation {
    private readonly toggleSpellsAvailabilityService;
    private readonly logger;

    constructor({ toggleSpellsAvailabilityService, logger }: ToggleSpellsAvailabilityOperationContract) {
        this.toggleSpellsAvailabilityService = toggleSpellsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Spell>> {
        this.logger('info', 'Execute - ToggleSpellsAvailabilityOperation');
        const spells = await this.toggleSpellsAvailabilityService.toggle({
            id,
            availability,
        });

        return spells;
    }
}
