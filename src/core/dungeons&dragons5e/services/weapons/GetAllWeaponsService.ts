import { Weapon } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllWeaponsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetAllWeapons';

export default class GetAllWeaponsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllWeaponsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Weapon>>> {
        this._logger('info', 'GetAll - GetAllWeaponsService');
        this._dungeonsAndDragonsRepository.setEntity('Weapons');

        const weaponsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Weapon>>;

        return weaponsInDb;
    }
}
