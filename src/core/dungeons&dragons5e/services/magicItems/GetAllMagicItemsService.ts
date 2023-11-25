import { MagicItem } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllMagicItemsServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/magicItems/GetAllMagicItems';

export default class GetAllMagicItemsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetAllMagicItemsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<MagicItem>>> {
        this._logger('info', 'GetAll - GetAllMagicItemsService');
        this._dungeonsAndDragonsRepository.setEntity('MagicItems');

        const magicItemsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<MagicItem>>;
        return magicItemsInDb;
    }
}
