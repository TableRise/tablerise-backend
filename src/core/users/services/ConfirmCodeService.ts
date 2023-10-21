import { ConfirmCodeServiceContract } from 'src/types/contracts/users/ConfirmCode';
import { ConfirmCodePayload } from 'src/types/requests/Payload';
import { ConfirmCodeResponse } from 'src/types/requests/Response';

export default class ConfirmCodeService extends ConfirmCodeServiceContract {
    constructor({ usersRepository, httpRequestErrors, logger }: ConfirmCodeServiceContract) {
        super();
        this.usersRepository = usersRepository;
        this.httpRequestErrors = httpRequestErrors;
        this.logger = logger;
    }

    public async processCode({ userId, code }: ConfirmCodePayload): Promise<ConfirmCodeResponse> {
        this.logger('info', '[VerifyCode - ConfirmCodeService]');
        const userInDb = await this.usersRepository.findOne(userId);

        if (userInDb.inProgress.code !== code) {
            this.logger('error', 'Code is invalid - ConfirmCodeService');
            this.httpRequestErrors.throwError('invalid-email-verify-code');
        }

        userInDb.inProgress.status = 'done';

        await this.usersRepository.update({ id: userInDb.userId, payload: userInDb });

        return { status: userInDb.inProgress.status };
    }
}