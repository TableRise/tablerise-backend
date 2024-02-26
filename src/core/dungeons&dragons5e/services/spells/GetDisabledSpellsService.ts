import { Spell } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledSpellsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetDisabledSpells';

export default class GetDisabledSpellsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledSpellsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Spell>>> {
        this._logger('info', 'getAllDisabled - GetDisabledSpellsService');
        this._dungeonsAndDragonsRepository.setEntity('Spells');

        const spellsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Spell>>;

        return spellsInDb;
    }
}
