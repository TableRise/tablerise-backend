import { Armor } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetAllArmorsServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/armors/GetAllArmorsService';

export default class GetAllArmorsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllArmorsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Armor>>> {
        this._logger('info', 'GetAll - GetAllArmorsService');
        this._dungeonsAndDragonsRepository.setEntity('Armors');

        const armorsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Armor>>;
        return armorsInDb;
    }
}
