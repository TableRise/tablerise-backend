import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { God } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllGodsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetAllGodsOperation';

export default class GetAllGodsOperation {
    private readonly getAllGodsService;
    private readonly logger;

    constructor({ getAllGodsService, logger }: GetAllGodsOperationContract) {
        this.getAllGodsService = getAllGodsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<God>>> {
        this.logger('info', 'Execute - GetAllGodsOperation');
        const gods = await this.getAllGodsService.getAll();
        return gods;
    }
}
