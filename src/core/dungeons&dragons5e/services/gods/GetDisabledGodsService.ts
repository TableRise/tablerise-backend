import { God } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledGodsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetDisabledGodsService';

export default class GetDisabledGodsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledGodsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<God>>> {
        this.logger('info', 'GetAll - GetDisabledGodsService');
        this.dungeonsAndDragonsRepository.setEntity('Gods');

        const godInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<God>>;
        return godInDb;
    }
}
