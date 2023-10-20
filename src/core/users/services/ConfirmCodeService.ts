import { ConfirmCodeServiceContract } from 'src/types/contracts/users/ConfirmCode';
import { ConfirmCodePayload } from 'src/types/requests/Payload';
import { ConfirmCodeResponse } from 'src/types/requests/Response';

export default class ConfirmCodeService extends ConfirmCodeServiceContract {
    constructor({ usersModel, httpRequestErrors, logger }: ConfirmCodeServiceContract) {
        super();
        this.usersModel = usersModel;
        this.httpRequestErrors = httpRequestErrors;
        this.logger = logger;
    }

    public async processCode({ userId, code }: ConfirmCodePayload): Promise<ConfirmCodeResponse> {
        this.logger('info', '[VerifyCode - ConfirmCodeService]');
        const userInDb = await this.usersModel.findAll({ userId });

        if (!userInDb.length) {
            this.logger('error', 'Some error ocurred in email sending - ConfirmCodeService');
            this.httpRequestErrors.throwError('user-inexistent');
        }

        if (userInDb[0].inProgress.code !== code) {
            this.logger('error', 'Code is invalid - ConfirmCodeService');
            this.httpRequestErrors.throwError('invalid-email-verify-code');
        }

        userInDb[0].inProgress.status = 'done';

        await this.usersModel.update(userInDb[0].userId, userInDb[0]);

        return { status: userInDb[0].inProgress.status };
    }
}