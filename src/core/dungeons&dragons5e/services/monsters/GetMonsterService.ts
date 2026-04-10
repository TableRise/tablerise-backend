import { Monster } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetMonsterServiceContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetMonster';

export default class GetMonsterService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetMonsterServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Monster>> {
        this.logger('info', 'GetAll - GetMonsterService');
        this.dungeonsAndDragonsRepository.setEntity('Monsters');

        const monsterInDb = (await this.dungeonsAndDragonsRepository.findOne({
            monsterId: id,
        })) as Internacional<Monster>;
        return monsterInDb;
    }
}
