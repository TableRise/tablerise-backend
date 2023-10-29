import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import { ResetTwoFactorServiceContract } from 'src/types/users/contracts/core/ResetTwoFactor';
import { ConfirmCodePayload } from 'src/types/users/requests/Payload';
import { TwoFactorResponse } from 'src/types/users/requests/Response';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';

export default class ResetTwoFactorService {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({ usersRepository, logger }: ResetTwoFactorServiceContract) {
        this._usersRepository = usersRepository;
        this._logger = logger;

        this._generateTwoFactor = this._generateTwoFactor.bind(this);
    }

    private async _generateTwoFactor(user: UserInstance): Promise<UserInstance> {
        this._logger('info', 'GenerateTwoFactor - ActivateTwoFactorService');
        const secret = speakeasy.generateSecret();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `TableRise 2FA (${user.email})`,
            issuer: 'TableRise',
            encoding: 'base32',
        });

        user.inProgress.status = 'done';

        user.twoFactorSecret = {
            secret: secret.base32,
            qrcode: await qrcode.toDataURL(url),
            active: true,
        };

        return user;
    }

    public async reset({ userId, code }: ConfirmCodePayload): Promise<TwoFactorResponse> {
        this._logger('info', 'Reset - ResetTwoFactorService');
        const userInDb = await this._usersRepository.findOne({ userId });

        if (!userInDb.twoFactorSecret.active) {
            this._logger(
                'error',
                'User does not have 2FA active - ResetTwoFactorService'
            );
            HttpRequestErrors.throwError('2fa-no-active');
        }

        if (userInDb.inProgress.code !== code) {
            this._logger('error', 'Code is invalid - ResetTwoFactorService');
            HttpRequestErrors.throwError('invalid-email-verify-code');
        }

        const userWithTwoFactor = await this._generateTwoFactor(userInDb);
        await this._usersRepository.update({
            query: { userId: userWithTwoFactor.userId },
            payload: userWithTwoFactor,
        });

        return {
            qrcode: userWithTwoFactor.twoFactorSecret.qrcode as string,
            active: userWithTwoFactor.twoFactorSecret.active,
        };
    }
}
