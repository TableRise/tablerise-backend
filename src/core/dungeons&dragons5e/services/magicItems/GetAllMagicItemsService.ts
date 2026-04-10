import { MagicItem } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllMagicItemsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/GetAllMagicItems';

export default class GetAllMagicItemsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllMagicItemsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<MagicItem>>> {
        this.logger('info', 'GetAll - GetAllMagicItemsService');
        this.dungeonsAndDragonsRepository.setEntity('MagicItems');

        const magicItemsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<MagicItem>>;
        return magicItemsInDb;
    }
}
