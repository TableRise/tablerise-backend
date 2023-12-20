import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Feat } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { GetAllFeatsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/feats/GetAllFeats';

export default class GetAllFeatsOperation {
    private readonly _getAllFeatsService;
    private readonly _logger;

    constructor({ getAllFeatsService, logger }: GetAllFeatsOperationContract) {
        this._getAllFeatsService = getAllFeatsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Feat>>> {
        this._logger('info', 'Execute - GetAllFeatsOperation');
        const feats = await this._getAllFeatsService.getAll();
        return feats;
    }
}
