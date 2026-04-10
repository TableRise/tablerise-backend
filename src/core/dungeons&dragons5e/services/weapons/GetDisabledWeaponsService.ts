import { Weapon } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledWeaponsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetDisabledWeapons';

export default class GetDisabledWeaponsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledWeaponsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Weapon>>> {
        this.logger('info', 'getAllDisabled - GetDisabledWeaponsService');
        this.dungeonsAndDragonsRepository.setEntity('Weapons');

        const weaponsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Weapon>>;

        return weaponsInDb;
    }
}
