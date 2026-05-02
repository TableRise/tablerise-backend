import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetByLevelSpellsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetByLevelSpells';

export default class GetByLevelSpellsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetByLevelSpellsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getByLevel = this.getByLevel.bind(this);
    }

    public async getByLevel(queryLevel: number): Promise<Array<Internacional<Spell>>> {
        this.logger('info', 'GetByLevel - GetByLevelSpellsService');
        this.dungeonsAndDragonsRepository.setEntity('Spells');

        const spellsInDb = (await this.dungeonsAndDragonsRepository.find({ 'en.level': queryLevel })) as Array<
            Internacional<Spell>
        >;

        return spellsInDb;
    }
}
