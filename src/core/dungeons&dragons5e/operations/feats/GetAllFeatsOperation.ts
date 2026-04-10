import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Feat } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllFeatsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/feats/GetAllFeats';

export default class GetAllFeatsOperation {
    private readonly getAllFeatsService;
    private readonly logger;

    constructor({ getAllFeatsService, logger }: GetAllFeatsOperationContract) {
        this.getAllFeatsService = getAllFeatsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Feat>>> {
        this.logger('info', 'Execute - GetAllFeatsOperation');
        const feats = await this.getAllFeatsService.getAll();
        return feats;
    }
}
