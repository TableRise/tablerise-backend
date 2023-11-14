import { Spell } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleSpellsAvailabilityServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/spells/ToggleSpellsAvailability';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

export default class ToggleSpellsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: ToggleSpellsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Spell>> {
        this._logger('info', 'Toggle - ToggleSpellsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Spells');

        const spellInDb = (await this._dungeonsAndDragonsRepository.findOne({
            spellId: id,
        })) as Internacional<Spell>;

        spellInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { spellId: id },
            payload: spellInDb,
        });

        return spellInDb;
    }
}
