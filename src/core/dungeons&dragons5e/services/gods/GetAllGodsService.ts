import { God } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllGodsServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/gods/GetAllGodsService';

export default class GetAllGodsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllGodsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<God>>> {
        this._logger('info', 'GetAll - GetAllGodsService');
        this._dungeonsAndDragonsRepository.setEntity('Gods');

        const godsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<God>>;
        return godsInDb;
    }
}
