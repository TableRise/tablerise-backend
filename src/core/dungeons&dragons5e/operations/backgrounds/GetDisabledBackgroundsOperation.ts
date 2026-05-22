import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledBackgroundsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetDisabledBackgrounds';

export default class GetDisabledBackgroundsOperation {
    private readonly getDisabledBackgroundsService;
    private readonly logger;

    constructor({ getDisabledBackgroundsService, logger }: GetDisabledBackgroundsOperationContract) {
        this.getDisabledBackgroundsService = getDisabledBackgroundsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Background>>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const backgrounds = await this.getDisabledBackgroundsService.getAllDisabled();
        return backgrounds;
    }
}
