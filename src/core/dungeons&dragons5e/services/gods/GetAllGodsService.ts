import { God } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllGodsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetAllGodsService';

export default class GetAllGodsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllGodsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<God>>> {
        this.logger('info', 'GetAll - GetAllGodsService');
        this.dungeonsAndDragonsRepository.setEntity('Gods');

        const godsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<God>>;
        return godsInDb;
    }
}
