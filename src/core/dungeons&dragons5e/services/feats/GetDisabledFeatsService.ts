import { Feat } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledFeatsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/feats/GetDisabledFeats';

export default class GetDisabledFeatsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledFeatsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Feat>>> {
        this.logger('info', 'GetAll - GetDisabledFeatsService');
        this.dungeonsAndDragonsRepository.setEntity('Feats');

        const featInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Feat>>;
        return featInDb;
    }
}
