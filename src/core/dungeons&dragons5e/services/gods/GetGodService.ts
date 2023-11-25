import { God } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetGodServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/gods/GetGodService';

export default class GetGodService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetGodServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<God>> {
        this._logger('info', 'GetAll - GetGodService');
        this._dungeonsAndDragonsRepository.setEntity('Gods');

        const godInDb = (await this._dungeonsAndDragonsRepository.findOne({
            godId: id,
        })) as Internacional<God>;
        return godInDb;
    }
}
