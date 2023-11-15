import { Armor } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetArmorServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/armors/GetArmorService';

export default class GetArmorService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetArmorServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Armor>> {
        this._logger('info', 'GetAll - GetArmorService');
        this._dungeonsAndDragonsRepository.setEntity('Armors');

        const armorInDb = (await this._dungeonsAndDragonsRepository.findOne({
            armorId: id,
        })) as Internacional<Armor>;
        return armorInDb;
    }
}
