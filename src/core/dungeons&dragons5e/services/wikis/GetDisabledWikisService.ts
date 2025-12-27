import { Wiki } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledWikisServiceContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/GetDisabledWikis';

export default class GetDisabledWikisService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledWikisServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Wiki>>> {
        this.logger('info', 'getAllDisabled - GetDisabledWikisService');
        this.dungeonsAndDragonsRepository.setEntity('Wikis');

        const wikisInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Wiki>>;

        return wikisInDb;
    }
}
