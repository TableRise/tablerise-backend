import { God } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledGodsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetDisabledGodsOperation';

export default class GetDisabledGodsOperation {
    private readonly getDisabledGodsService;
    private readonly logger;

    constructor({ getDisabledGodsService, logger }: GetDisabledGodsOperationContract) {
        this.getDisabledGodsService = getDisabledGodsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<God>>> {
        this.logger('info', 'Execute - GetGodOperation');
        const gods = await this.getDisabledGodsService.getAllDisabled();
        return gods;
    }
}
