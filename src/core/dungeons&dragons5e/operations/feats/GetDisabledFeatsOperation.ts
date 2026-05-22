import { Feat } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledFeatsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/feats/GetDisabledFeats';

export default class GetDisabledFeatsOperation {
    private readonly getDisabledFeatsService;
    private readonly logger;

    constructor({ getDisabledFeatsService, logger }: GetDisabledFeatsOperationContract) {
        this.getDisabledFeatsService = getDisabledFeatsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Feat>>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const feats = await this.getDisabledFeatsService.getAllDisabled();
        return feats;
    }
}
