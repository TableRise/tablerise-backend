import { Class } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetClassOperationContract } from 'src/types/modules/core/dungeons&dragons5e/classes/GetClass';

export default class GetClassOperation {
    private readonly getClassService;
    private readonly logger;

    constructor({ getClassService, logger }: GetClassOperationContract) {
        this.getClassService = getClassService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Class>> {
        this.logger('info', 'Execute - GetClassOperation');
        const _class = await this.getClassService.get(id);
        return _class;
    }
}
