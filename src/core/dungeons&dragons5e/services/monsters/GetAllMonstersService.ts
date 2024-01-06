import { Monster } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllMonstersServiceContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetAllMonsters';

export default class GetAllMonstersService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllMonstersServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Monster>>> {
        this._logger('info', 'GetAll - GetAllMonstersService');
        this._dungeonsAndDragonsRepository.setEntity('Monsters');

        const monstersInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Monster>>;
        return monstersInDb;
    }
}
