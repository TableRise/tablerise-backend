import { Feat } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetFeatServiceContract } from 'src/types/modules/core/dungeons&dragons5e/feats/GetFeat';

export default class GetFeatService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetFeatServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Feat>> {
        this.logger('info', 'GetAll - GetFeatService');
        this.dungeonsAndDragonsRepository.setEntity('Feats');

        const featInDb = (await this.dungeonsAndDragonsRepository.findOne({
            featId: id,
        })) as Internacional<Feat>;
        return featInDb;
    }
}
