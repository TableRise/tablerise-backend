import { Monster } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledMonstersServiceContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetDisabledMonsters';

export default class GetDisabledMonstersService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledMonstersServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Monster>>> {
        this.logger('info', 'GetAll - GetDisabledMonstersService');
        this.dungeonsAndDragonsRepository.setEntity('Monsters');

        const monsterInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Monster>>;
        return monsterInDb;
    }
}
