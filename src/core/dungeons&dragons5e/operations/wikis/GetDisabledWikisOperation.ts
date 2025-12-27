import { Wiki } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledWikisOperationContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/GetDisabledWikis';

export default class GetDisabledWikisOperation {
    private readonly getDisabledWikisService;
    private readonly logger;

    constructor({ getDisabledWikisService, logger }: GetDisabledWikisOperationContract) {
        this.getDisabledWikisService = getDisabledWikisService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Wiki>>> {
        this.logger('info', 'Execute - GetDisabledWikisOperation');
        const wikis = await this.getDisabledWikisService.getAllDisabled();
        return wikis;
    }
}
