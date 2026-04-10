import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllRealmsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetAllRealms';

export default class GetAllRealmsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllRealmsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Realm>>> {
        this.logger('info', 'GetAll - GetAllRealmsService');
        this.dungeonsAndDragonsRepository.setEntity('Realms');

        const realmsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Realm>>;

        return realmsInDb;
    }
}
