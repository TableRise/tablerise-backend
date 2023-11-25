import { Wiki } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllWikisServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/wikis/GetAllWikis';

export default class GetAllWikisService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllWikisServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Wiki>>> {
        this._logger('info', 'GetAll - GetAllWikisService');
        this._dungeonsAndDragonsRepository.setEntity('Wikis');

        const wikisInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Wiki>>;

        return wikisInDb;
    }
}
