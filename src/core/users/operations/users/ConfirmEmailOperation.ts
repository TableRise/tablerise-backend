import { ConfirmEmailOperationContract } from 'src/types/users/contracts/core/ConfirmEmail';
import { ConfirmEmailPayload } from 'src/types/users/requests/Payload';
import { ConfirmEmailResponse } from 'src/types/users/requests/Response';

export default class ConfirmEmailOperation {
    private readonly _confirmEmailService;
    private readonly _logger;

    constructor({ confirmEmailService, logger }: ConfirmEmailOperationContract) {
        this._confirmEmailService = confirmEmailService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        email,
        code,
    }: ConfirmEmailPayload): Promise<ConfirmEmailResponse> {
        this._logger('info', 'Execute - ConfirmEmailOperation');
        return this._confirmEmailService.processCode({
            email,
            code,
        });
    }
}
