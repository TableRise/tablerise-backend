import { ConfirmCodeOperationContract } from 'src/types/contracts/users/ConfirmCode';
import { ConfirmCodePayload } from 'src/types/requests/Payload';
import { ConfirmCodeResponse } from 'src/types/requests/Response';

export default class ConfirmCodeOperation {
    private readonly _confirmCodeService;
    private readonly _logger;

    constructor({ confirmCodeService, logger }: ConfirmCodeOperationContract) {
        this._confirmCodeService = confirmCodeService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, code }: ConfirmCodePayload): Promise<ConfirmCodeResponse> {
        this._logger('info', 'Execute - ConfirmCodeOperation');
        const codeProcessing = await this._confirmCodeService.processCode({ userId, code });
        return codeProcessing;
    }
}
