import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Class } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { GetAllClassesOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/classes/GetAllClasses';

export default class GetAllClassesOperation {
    private readonly _getAllClassesService;
    private readonly _logger;

    constructor({ getAllClassesService, logger }: GetAllClassesOperationContract) {
        this._getAllClassesService = getAllClassesService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Class>>> {
        this._logger('info', 'Execute - GetAllClassesOperation');
        const classes = await this._getAllClassesService.getAll();
        return classes;
    }
}
