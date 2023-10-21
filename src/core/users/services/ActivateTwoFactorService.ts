import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import { ActivateTwoFactorServiceContract } from 'src/types/contracts/users/ActivateTwoFactor';
import { TwoFactorResponse } from 'src/types/requests/Response';

export default class ActivateTwoFactorService extends ActivateTwoFactorServiceContract {
    constructor({ usersRepository, usersDetailsRepository, httpRequestErrors, logger }: ActivateTwoFactorServiceContract) {
        super();
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.httpRequestErrors = httpRequestErrors;
        this.logger = logger;
    }

    private async generateTwoFactor(user: UserInstance): Promise<UserInstance> {
        this.logger('info', '[GenerateTwoFactor - ActivateTwoFactorService]');
        const secret = speakeasy.generateSecret();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `TableRise 2FA (${user.email})`,
            issuer: 'TableRise',
            encoding: 'base32'
        });

        user.twoFactorSecret = {
            secret: secret.base32,
            qrcode: await qrcode.toDataURL(url),
            active: true
        }

        return user;
    }

    public async activate(userId: string): Promise<TwoFactorResponse> {
        this.logger('info', '[Activate - ActivateTwoFactorService]');
        const userInDb = await this.usersRepository.findOne(userId);

        if (userInDb.twoFactorSecret.active) {
            this.logger('error', 'User already have 2FA already activated');
            this.httpRequestErrors.throwError('2fa-already-active');
        }

        const userWithTwoFactor = await this.generateTwoFactor(userInDb);
        const [userDetailInDb] = await this.usersDetailsRepository.find({ userId: userInDb.userId });

        userDetailInDb.secretQuestion = null;

        await this.usersRepository.update({ id: userInDb.userId, payload: userWithTwoFactor });
        await this.usersDetailsRepository.update({ id: userDetailInDb.userDetailId, payload: userDetailInDb });

        return { qrcode: userWithTwoFactor.twoFactorSecret.qrcode as string, active: userWithTwoFactor.twoFactorSecret.active };
    }
}
