import { Feat } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetFeatOperationContract } from 'src/types/modules/core/dungeons&dragons5e/feats/GetFeat';

export default class GetFeatOperation {
    private readonly getFeatService;
    private readonly logger;

    constructor({ getFeatService, logger }: GetFeatOperationContract) {
        this.getFeatService = getFeatService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Feat>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const feat = await this.getFeatService.get(id);
        return feat;
    }
}
