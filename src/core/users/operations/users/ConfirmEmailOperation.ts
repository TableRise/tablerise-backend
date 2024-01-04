import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { ConfirmEmailPayload } from 'src/types/users/requests/Payload';
import { ConfirmEmailResponse } from 'src/types/users/requests/Response';

export default class ConfirmEmailOperation {
    private readonly _confirmEmailService;
    private readonly _logger;

    constructor({ confirmEmailService, logger }: UserCoreDependencies['confirmEmailOperationContract']) {
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
