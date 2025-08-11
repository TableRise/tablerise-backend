import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllRealmsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetAllRealms';

export default class GetAllRealmsOperation {
    private readonly _getAllRealmsService;
    private readonly _logger;

    constructor({ getAllRealmsService, logger }: GetAllRealmsOperationContract) {
        this._getAllRealmsService = getAllRealmsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Realm>>> {
        this._logger('info', 'Execute - GetAllRealmsOperation');
        const realms = await this._getAllRealmsService.getAll();

        return realms;
    }
}
