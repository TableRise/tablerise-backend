import { Class } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetClassOperationContract } from 'src/types/modules/core/dungeons&dragons5e/classes/GetClass';

export default class GetClassOperation {
    private readonly _getClassService;
    private readonly _logger;

    constructor({ getClassService, logger }: GetClassOperationContract) {
        this._getClassService = getClassService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Class>> {
        this._logger('info', 'Execute - GetClassOperation');
        const _class = await this._getClassService.get(id);
        return _class;
    }
}
