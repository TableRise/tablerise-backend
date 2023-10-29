import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { ConfirmCodeServiceContract } from 'src/types/users/contracts/core/ConfirmCode';
import { ConfirmCodePayload } from 'src/types/users/requests/Payload';
import { ConfirmCodeResponse } from 'src/types/users/requests/Response';

export default class ConfirmCodeService {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({ usersRepository, logger }: ConfirmCodeServiceContract) {
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.processCode = this.processCode.bind(this);
    }

    public async processCode({
        userId,
        code,
    }: ConfirmCodePayload): Promise<ConfirmCodeResponse> {
        this._logger('info', 'VerifyCode - ConfirmCodeService');
        const userInDb = await this._usersRepository.findOne({ userId });

        if (userInDb.inProgress.code !== code)
            HttpRequestErrors.throwError('invalid-email-verify-code');

        userInDb.inProgress.status = 'done';

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb
        });

        return { status: userInDb.inProgress.status };
    }
}
