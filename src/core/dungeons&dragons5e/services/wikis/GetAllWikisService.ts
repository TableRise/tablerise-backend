import { Wiki } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllWikisServiceContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/GetAllWikis';

export default class GetAllWikisService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllWikisServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Wiki>>> {
        this.logger('info', 'GetAll - GetAllWikisService');
        this.dungeonsAndDragonsRepository.setEntity('Wikis');

        const wikisInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Wiki>>;

        return wikisInDb;
    }
}
