import { Background } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetBackgroundOperationContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetBackground';

export default class GetBackgroundOperation {
    private readonly getBackgroundService;
    private readonly logger;

    constructor({ getBackgroundService, logger }: GetBackgroundOperationContract) {
        this.getBackgroundService = getBackgroundService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Background>> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const background = await this.getBackgroundService.get(id);
        return background;
    }
}
