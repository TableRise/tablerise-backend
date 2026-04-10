import { Monster } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllMonstersServiceContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetAllMonsters';

export default class GetAllMonstersService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllMonstersServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Monster>>> {
        this.logger('info', 'GetAll - GetAllMonstersService');
        this.dungeonsAndDragonsRepository.setEntity('Monsters');

        const monstersInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Monster>>;
        return monstersInDb;
    }
}
