import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import { ActivateTwoFactorServiceContract } from 'src/types/users/contracts/core/ActivateTwoFactor';
import { TwoFactorResponse } from 'src/types/users/requests/Response';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';

export default class ActivateTwoFactorService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: ActivateTwoFactorServiceContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this._generateTwoFactor = this._generateTwoFactor.bind(this);
        this.activate = this.activate.bind(this);
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

        user.twoFactorSecret = {
            secret: secret.base32,
            qrcode: await qrcode.toDataURL(url),
            active: true,
        };

        return user;
    }

    public async activate(userId: string): Promise<TwoFactorResponse> {
        this._logger('info', 'Activate - ActivateTwoFactorService');
        const userInDb = await this._usersRepository.findOne({ userId });

        if (userInDb.twoFactorSecret.active) {
            this._logger(
                'error',
                'User already have 2FA already activated - ActivateTwoFactorService'
            );
            HttpRequestErrors.throwError('2fa-already-active');
        }

        const userWithTwoFactor = await this._generateTwoFactor(userInDb);
        const userDetailInDb = await this._usersDetailsRepository.findOne({
            userId: userInDb.userId,
        });

        userDetailInDb.secretQuestion = null;

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userWithTwoFactor,
        });

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });

        return {
            qrcode: userWithTwoFactor.twoFactorSecret.qrcode as string,
            active: userWithTwoFactor.twoFactorSecret.active,
        };
    }
}
