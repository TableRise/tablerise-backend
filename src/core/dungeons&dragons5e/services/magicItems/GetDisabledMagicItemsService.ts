import { MagicItem } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledMagicItemsServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/magicItems/GetDisabledMagicItems';

export default class GetDisabledMagicItemsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledMagicItemsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<MagicItem>>> {
        this._logger('info', 'GetAll - GetDisabledMagicItemsService');
        this._dungeonsAndDragonsRepository.setEntity('MagicItems');

        const magicItemInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<MagicItem>>;
        return magicItemInDb;
    }
}
