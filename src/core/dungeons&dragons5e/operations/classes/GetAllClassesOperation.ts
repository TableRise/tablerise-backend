import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Class } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllClassesOperationContract } from 'src/types/modules/core/dungeons&dragons5e/classes/GetAllClasses';

export default class GetAllClassesOperation {
    private readonly getAllClassesService;
    private readonly logger;

    constructor({ getAllClassesService, logger }: GetAllClassesOperationContract) {
        this.getAllClassesService = getAllClassesService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Class>>> {
        this.logger('info', 'Execute - GetAllClassesOperation');
        const classes = await this.getAllClassesService.getAll();
        return classes;
    }
}
