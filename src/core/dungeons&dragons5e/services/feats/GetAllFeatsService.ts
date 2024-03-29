import { Feat } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllFeatsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/feats/GetAllFeats';

export default class GetAllFeatsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllFeatsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Feat>>> {
        this._logger('info', 'GetAll - GetAllFeatsService');
        this._dungeonsAndDragonsRepository.setEntity('Feats');

        const featsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Feat>>;
        return featsInDb;
    }
}
