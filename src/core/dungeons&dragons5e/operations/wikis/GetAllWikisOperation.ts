import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Wiki } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { GetAllWikisOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/wikis/GetAllWikis';

export default class GetAllWikisOperation {
    private readonly _getAllWikisService;
    private readonly _logger;

    constructor({ getAllWikisService, logger }: GetAllWikisOperationContract) {
        this._getAllWikisService = getAllWikisService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Wiki>>> {
        this._logger('info', 'Execute - GetAllWikisOperation');
        const wikis = await this._getAllWikisService.getAll();
        return wikis;
    }
}
