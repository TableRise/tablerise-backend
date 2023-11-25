import { Feat } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetFeatServiceContract } from 'src/types/dungeons&dragons5e/contracts/core/feats/GetFeat';

export default class GetFeatService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetFeatServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Feat>> {
        this._logger('info', 'GetAll - GetFeatService');
        this._dungeonsAndDragonsRepository.setEntity('Feats');

        const featInDb = (await this._dungeonsAndDragonsRepository.findOne({
            featId: id,
        })) as Internacional<Feat>;
        return featInDb;
    }
}
