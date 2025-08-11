import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetRealmServiceContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetRealm';

export default class GetRealmService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetRealmServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Realm>> {
        this._logger('info', 'Get - GetRealmService');
        this._dungeonsAndDragonsRepository.setEntity('Realms');

        const realmInDb = (await this._dungeonsAndDragonsRepository.findOne({
            realmId: id,
        })) as Internacional<Realm>;

        return realmInDb;
    }
}
