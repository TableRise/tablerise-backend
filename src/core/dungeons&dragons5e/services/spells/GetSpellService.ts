import { Spell } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetSpellServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/spells/GetSpell';

export default class GetSpellService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetSpellServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Spell>> {
        this._logger('info', 'Get - GetSpellService');
        this._dungeonsAndDragonsRepository.setEntity('Spells');

        const spellInDb = (await this._dungeonsAndDragonsRepository.findOne({
            spellId: id,
        })) as Internacional<Spell>;

        return spellInDb;
    }
}
