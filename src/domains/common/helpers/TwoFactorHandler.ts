import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { TwoFactorHandlerContract } from 'src/types/users/contracts/infra/TwoFactorHandler';
import { UserTwoFactor } from 'src/domains/users/schemas/usersValidationSchema';
import { TwoFactorValidatePayload } from 'src/types/users/requests/Payload';

export default class TwoFactorHandler {
    private readonly _configs;
    private readonly _logger;

    constructor({ configs, logger }: TwoFactorHandlerContract) {
        this._configs = configs;
        this._logger = logger;

        this.create = this.create.bind(this);
    }

    public async create(labelAttach: string): Promise<UserTwoFactor> {
        this._logger('info', 'Create - TwoFactorHandler');
        const secret = speakeasy.generateSecret();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${
                this._configs.twoFactorGen.params.label as string
            } (${labelAttach})`,
            issuer: this._configs.twoFactorGen.params.issuer,
            encoding: this._configs.twoFactorGen.params.encoding,
        });

        const QRCode = await qrcode.toDataURL(url);

        return {
            active: true,
            qrcode: QRCode,
            secret: secret.base32,
        };
    }

    public validate({ secret, token }: TwoFactorValidatePayload): boolean {
        const valid = speakeasy.totp.verify({
            secret,
            encoding: this._configs.twoFactorGen.params.encoding,
            token,
        });

        return valid;
    }
}
