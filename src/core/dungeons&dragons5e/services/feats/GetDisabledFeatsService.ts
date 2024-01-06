import { Feat } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledFeatsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/feats/GetDisabledFeats';

export default class GetDisabledFeatsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({
        dungeonsAndDragonsRepository,
        logger,
    }: GetDisabledFeatsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Feat>>> {
        this._logger('info', 'GetAll - GetDisabledFeatsService');
        this._dungeonsAndDragonsRepository.setEntity('Feats');

        const featInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Feat>>;
        return featInDb;
    }
}
