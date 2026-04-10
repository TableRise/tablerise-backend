import { God } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetGodOperationContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetGodOperation';

export default class GetGodOperation {
    private readonly getGodService;
    private readonly logger;

    constructor({ getGodService, logger }: GetGodOperationContract) {
        this.getGodService = getGodService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<God>> {
        this.logger('info', 'Execute - GetGodOperation');
        const god = await this.getGodService.get(id);
        return god;
    }
}
