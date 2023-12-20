import { Weapon } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetWeaponServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/weapons/GetWeapon';

export default class GetWeaponService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetWeaponServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Weapon>> {
        this._logger('info', 'Get - GetWeaponService');
        this._dungeonsAndDragonsRepository.setEntity('Weapons');

        const weaponInDb = (await this._dungeonsAndDragonsRepository.findOne({
            WeaponId: id,
        })) as Internacional<Weapon>;

        return weaponInDb;
    }
}
