import { Realm } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetRealmOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/realms/GetRealm';

export default class GetRealmOperation {
    private readonly _getRealmService;
    private readonly _logger;

    constructor({ getRealmService, logger }: GetRealmOperationContract) {
        this._getRealmService = getRealmService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Realm>> {
        this._logger('info', 'Execute - GetRealmOperation');
        const realm = await this._getRealmService.get(id);

        return realm;
    }
}
