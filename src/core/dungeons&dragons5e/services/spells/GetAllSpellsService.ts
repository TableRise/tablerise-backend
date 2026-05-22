import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllSpellsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetAllSpells';

export default class GetAllSpellsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllSpellsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Spell>>> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Spells');

        const spellsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Spell>>;

        return spellsInDb;
    }
}
