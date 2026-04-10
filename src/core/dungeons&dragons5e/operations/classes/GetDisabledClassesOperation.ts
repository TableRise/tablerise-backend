import { Class } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledClassesOperationContract } from 'src/types/modules/core/dungeons&dragons5e/classes/GetDisabledClasses';

export default class GetDisabledClassesOperation {
    private readonly getDisabledClassesService;
    private readonly logger;

    constructor({ getDisabledClassesService, logger }: GetDisabledClassesOperationContract) {
        this.getDisabledClassesService = getDisabledClassesService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Class>>> {
        this.logger('info', 'Execute - GetClassOperation');
        const classes = await this.getDisabledClassesService.getAllDisabled();
        return classes;
    }
}
