import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetSpellServiceContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetSpell';

export default class GetSpellService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetSpellServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Spell>> {
        const callName = `[${this.constructor.name}] - ${this.get.name}`;
        this.logger('info', callName);
        this.dungeonsAndDragonsRepository.setEntity('Spells');

        const spellInDb = (await this.dungeonsAndDragonsRepository.findOne({
            spellId: id,
        })) as Internacional<Spell>;

        return spellInDb;
    }
}
