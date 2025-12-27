import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetRealmServiceContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetRealm';

export default class GetRealmService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetRealmServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Realm>> {
        this.logger('info', 'Get - GetRealmService');
        this.dungeonsAndDragonsRepository.setEntity('Realms');

        const realmInDb = (await this.dungeonsAndDragonsRepository.findOne({
            realmId: id,
        })) as Internacional<Realm>;

        return realmInDb;
    }
}
