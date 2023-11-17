import { God } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledGodsServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/gods/GetDisabledGodsService';

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
