import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllSpellsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetAllSpells';

export default class GetAllSpellsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllSpellsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Spell>>> {
        this._logger('info', 'GetAll - GetAllSpellsService');
        this._dungeonsAndDragonsRepository.setEntity('Spells');

        const spellsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Spell>>;

        return spellsInDb;
    }
}
