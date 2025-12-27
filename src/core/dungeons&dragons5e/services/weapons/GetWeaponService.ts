import { Weapon } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetWeaponServiceContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetWeapon';

export default class GetWeaponService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetWeaponServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Weapon>> {
        this.logger('info', 'Get - GetWeaponService');
        this.dungeonsAndDragonsRepository.setEntity('Weapons');

        const weaponInDb = (await this.dungeonsAndDragonsRepository.findOne({
            WeaponId: id,
        })) as Internacional<Weapon>;

        return weaponInDb;
    }
}
