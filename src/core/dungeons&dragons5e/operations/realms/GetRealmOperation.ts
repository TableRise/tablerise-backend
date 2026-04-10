import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetRealmOperationContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetRealm';

export default class GetRealmOperation {
    private readonly getRealmService;
    private readonly logger;

    constructor({ getRealmService, logger }: GetRealmOperationContract) {
        this.getRealmService = getRealmService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Realm>> {
        this.logger('info', 'Execute - GetRealmOperation');
        const realm = await this.getRealmService.get(id);

        return realm;
    }
}
