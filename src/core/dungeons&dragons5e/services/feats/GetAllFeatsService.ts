import { Feat } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllFeatsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/feats/GetAllFeats';

export default class GetAllFeatsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllFeatsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Feat>>> {
        this.logger('info', 'GetAll - GetAllFeatsService');
        this.dungeonsAndDragonsRepository.setEntity('Feats');

        const featsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Feat>>;
        return featsInDb;
    }
}
