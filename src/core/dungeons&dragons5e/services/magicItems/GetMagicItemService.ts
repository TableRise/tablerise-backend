import { MagicItem } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetMagicItemServiceContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/GetMagicItem';

export default class GetMagicItemService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetMagicItemServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<MagicItem>> {
        this.logger('info', 'GetAll - GetMagicItemService');
        this.dungeonsAndDragonsRepository.setEntity('MagicItems');

        const magicItemInDb = (await this.dungeonsAndDragonsRepository.findOne({
            magicItemId: id,
        })) as Internacional<MagicItem>;
        return magicItemInDb;
    }
}
