import { Monster } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetMonsterServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/monsters/GetMonster';

export default class GetMonsterService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetMonsterServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Monster>> {
        this._logger('info', 'GetAll - GetMonsterService');
        this._dungeonsAndDragonsRepository.setEntity('Monsters');

        const monsterInDb = (await this._dungeonsAndDragonsRepository.findOne({
            monsterId: id,
        })) as Internacional<Monster>;
        return monsterInDb;
    }
}
