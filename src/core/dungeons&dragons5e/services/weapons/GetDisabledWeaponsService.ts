import { Weapon } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledWeaponsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetDisabledWeapons';

export default class GetDisabledWeaponsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledWeaponsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Weapon>>> {
        this._logger('info', 'getAllDisabled - GetDisabledWeaponsService');
        this._dungeonsAndDragonsRepository.setEntity('Weapons');

        const weaponsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Weapon>>;

        return weaponsInDb;
    }
}
