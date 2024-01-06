import { Armor } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledArmorsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/armors/GetDisabledArmors';

export default class GetDisabledArmorsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledArmorsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Armor>>> {
        this._logger('info', 'GetAll - GetDisabledArmorsService');
        this._dungeonsAndDragonsRepository.setEntity('Armors');

        const armorInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Armor>>;
        return armorInDb;
    }
}
