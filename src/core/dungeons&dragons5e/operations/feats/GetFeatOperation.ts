import { Feat } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetFeatOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/feats/GetFeat';

export default class GetFeatOperation {
    private readonly _getFeatService;
    private readonly _logger;

    constructor({ getFeatService, logger }: GetFeatOperationContract) {
        this._getFeatService = getFeatService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Feat>> {
        this._logger('info', 'Execute - GetFeatOperation');
        const feat = await this._getFeatService.get(id);
        return feat;
    }
}
