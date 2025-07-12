import { Background } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllBackgroundsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/backgrounds/GetAllBackgrounds';

export default class GetAllBackgroundsOperation {
    private readonly _getAllBackgroundsService;
    private readonly _logger;

    constructor({ getAllBackgroundsService, logger }: GetAllBackgroundsOperationContract) {
        this._getAllBackgroundsService = getAllBackgroundsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Background>>> {
        this._logger('info', 'Execute - GetAllBackgroundsOperation');
        const backgrounds = await this._getAllBackgroundsService.getAll();

        return backgrounds;
    }
}
