import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllBackgroundsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetAllBackgrounds';

export default class GetAllBackgroundsOperation {
    private readonly getAllBackgroundsService;
    private readonly logger;

    constructor({ getAllBackgroundsService, logger }: GetAllBackgroundsOperationContract) {
        this.getAllBackgroundsService = getAllBackgroundsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Background>>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const backgrounds = await this.getAllBackgroundsService.getAll();

        return backgrounds;
    }
}
