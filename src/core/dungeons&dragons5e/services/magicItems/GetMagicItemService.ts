import { MagicItem } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetMagicItemServiceContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/GetMagicItem';

export default class GetMagicItemService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetMagicItemServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<MagicItem>> {
        this._logger('info', 'GetAll - GetMagicItemService');
        this._dungeonsAndDragonsRepository.setEntity('MagicItems');

        const magicItemInDb = (await this._dungeonsAndDragonsRepository.findOne({
            magicItemId: id,
        })) as Internacional<MagicItem>;
        return magicItemInDb;
    }
}
