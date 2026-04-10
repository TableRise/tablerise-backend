import { Weapon } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllWeaponsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetAllWeapons';

export default class GetAllWeaponsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllWeaponsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Weapon>>> {
        this.logger('info', 'GetAll - GetAllWeaponsService');
        this.dungeonsAndDragonsRepository.setEntity('Weapons');

        const weaponsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Weapon>>;

        return weaponsInDb;
    }
}
