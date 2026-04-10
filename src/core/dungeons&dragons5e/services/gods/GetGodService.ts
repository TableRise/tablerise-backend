import { God } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetGodServiceContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetGodService';

export default class GetGodService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetGodServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<God>> {
        this.logger('info', 'GetAll - GetGodService');
        this.dungeonsAndDragonsRepository.setEntity('Gods');

        const godInDb = (await this.dungeonsAndDragonsRepository.findOne({
            godId: id,
        })) as Internacional<God>;
        return godInDb;
    }
}
