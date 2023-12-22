import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { ConfirmEmailServiceContract } from 'src/types/users/contracts/core/ConfirmEmail';
import { ConfirmEmailPayload } from 'src/types/users/requests/Payload';
import { ConfirmEmailResponse } from 'src/types/users/requests/Response';

export default class ConfirmEmailService {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({ usersRepository, logger }: ConfirmEmailServiceContract) {
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.processCode = this.processCode.bind(this);
    }

    public async processCode({
        email,
        code,
    }: ConfirmEmailPayload): Promise<ConfirmEmailResponse> {
        this._logger('info', 'VerifyCode - ConfirmEmailService');
        const userInDb = await this._usersRepository.findOne({ email });

        if (userInDb.inProgress.code !== code)
            HttpRequestErrors.throwError('invalid-email-verify-code');

        userInDb.inProgress.status = 'done';

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });

        return { status: userInDb.inProgress.status };
    }
}
