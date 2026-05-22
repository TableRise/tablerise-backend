import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleSpellsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/spells/ToggleSpellsAvailability';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleSpellsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleSpellsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Spell>> {
        const callName = `[${this.constructor.name}] - ${this.toggle.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Spells');

        const spellInDb = (await this.dungeonsAndDragonsRepository.findOne({
            spellId: id,
        })) as Internacional<Spell>;

        spellInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { spellId: id },
            payload: spellInDb,
        });

        return spellInDb;
    }
}
