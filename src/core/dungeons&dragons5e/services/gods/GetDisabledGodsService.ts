import { God } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledGodsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetDisabledGodsService';

export default class GetDisabledGodsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledGodsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<God>>> {
        this._logger('info', 'GetAll - GetDisabledGodsService');
        this._dungeonsAndDragonsRepository.setEntity('Gods');

        const godInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<God>>;
        return godInDb;
    }
}
