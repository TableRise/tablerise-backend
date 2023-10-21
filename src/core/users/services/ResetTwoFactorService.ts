import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { UserInstance } from "src/domains/user/schemas/usersValidationSchema";
import { ResetTwoFactorServiceContract } from "src/types/contracts/users/ResetTwoFactor";
import { ConfirmCodePayload } from "src/types/requests/Payload";
import { TwoFactorResponse } from "src/types/requests/Response";

export default class ResetTwoFactorService extends ResetTwoFactorServiceContract {
    constructor({ usersRepository, logger }: ResetTwoFactorServiceContract) {
        super();
        this.usersRepository = usersRepository;
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

        user.inProgress.status = 'done';

        user.twoFactorSecret = {
            secret: secret.base32,
            qrcode: await qrcode.toDataURL(url),
            active: true
        }

        return user;
    }

    public async reset({ userId, code }: ConfirmCodePayload): Promise<TwoFactorResponse> {
        this.logger('info', '[Reset - ResetTwoFactorService]');
        const userInDb = await this.usersRepository.findOne(userId);

        if (!userInDb.twoFactorSecret.active) {
            this.logger('error', 'User does not have 2FA active - ResetTwoFactorService');
            this.httpRequestErrors.throwError('2fa-no-active');
        }

        if (userInDb.inProgress.code !== code) {
            this.logger('error', 'Code is invalid - ResetTwoFactorService');
            this.httpRequestErrors.throwError('invalid-email-verify-code');
        }

        const userWithTwoFactor = await this.generateTwoFactor(userInDb);
        await this.usersRepository.update({ id: userWithTwoFactor.userId, payload: userWithTwoFactor });

        return { qrcode: userWithTwoFactor.twoFactorSecret.qrcode as string, active: userWithTwoFactor.twoFactorSecret.active };
    }
}
