import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledSpellsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetDisabledSpells';

export default class GetDisabledSpellsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledSpellsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Spell>>> {
        const callName = `[${this.constructor.name}] - ${this.getAllDisabled.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Spells');

        const spellsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Spell>>;

        return spellsInDb;
    }
}
