import { ConfirmCodeOperationContract } from 'src/types/contracts/users/ConfirmCode';
import { ConfirmCodePayload } from 'src/types/requests/Payload';
import { ConfirmCodeResponse } from 'src/types/requests/Response';

export default class ConfirmCodeOperation extends ConfirmCodeOperationContract {
    constructor({ confirmCodeService, logger }: ConfirmCodeOperationContract) {
        super();
        this.confirmCodeService = confirmCodeService;
        this.logger = logger;
    }

    public async execute({ userId, code }: ConfirmCodePayload): Promise<ConfirmCodeResponse> {
        this.logger('info', '[Execute - ConfirmCodeOperation]');
        const codeProcessing = await this.confirmCodeService.processCode({ userId, code });
        return codeProcessing;
    }
}