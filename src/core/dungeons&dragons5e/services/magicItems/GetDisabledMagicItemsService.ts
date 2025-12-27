import { MagicItem } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledMagicItemsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/GetDisabledMagicItems';

export default class GetDisabledMagicItemsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledMagicItemsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<MagicItem>>> {
        this.logger('info', 'GetAll - GetDisabledMagicItemsService');
        this.dungeonsAndDragonsRepository.setEntity('MagicItems');

        const magicItemInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<MagicItem>>;
        return magicItemInDb;
    }
}
