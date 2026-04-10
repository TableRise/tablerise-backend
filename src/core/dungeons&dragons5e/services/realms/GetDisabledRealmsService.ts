import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledRealmsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetDisabledRealms';

export default class GetDisabledRealmsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledRealmsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Realm>>> {
        this.logger('info', 'getAllDisabled - GetDisabledRealmsService');
        this.dungeonsAndDragonsRepository.setEntity('Realms');

        const realmsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Realm>>;

        return realmsInDb;
    }
}
