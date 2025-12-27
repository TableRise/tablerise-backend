import { Realm } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledRealmsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/realms/GetDisabledRealms';

export default class GetDisabledRealmsOperation {
    private readonly getDisabledRealmsService;
    private readonly logger;

    constructor({ getDisabledRealmsService, logger }: GetDisabledRealmsOperationContract) {
        this.getDisabledRealmsService = getDisabledRealmsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Realm>>> {
        this.logger('info', 'Execute - GetDisabledRealmsOperation');
        const realms = await this.getDisabledRealmsService.getAllDisabled();

        return realms;
    }
}
