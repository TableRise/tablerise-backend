import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Wiki } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllWikisOperationContract } from 'src/types/modules/core/dungeons&dragons5e/wikis/GetAllWikis';

export default class GetAllWikisOperation {
    private readonly getAllWikisService;
    private readonly logger;

    constructor({ getAllWikisService, logger }: GetAllWikisOperationContract) {
        this.getAllWikisService = getAllWikisService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Wiki>>> {
        this.logger('info', 'Execute - GetAllWikisOperation');
        const wikis = await this.getAllWikisService.getAll();
        return wikis;
    }
}
