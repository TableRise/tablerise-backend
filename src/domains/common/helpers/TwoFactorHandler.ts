import speakeasy, { Encoding } from 'speakeasy';
import qrcode from 'qrcode';
import Configs from 'src/types/shared/configs';
import { UserTwoFactor } from 'src/domains/users/schemas/usersValidationSchema';
import { TwoFactorHandlerContract, TwoFactorValidatePayload } from 'src/types/modules/domains/common/helpers/TwoFactorHandler';

export default class TwoFactorHandler {
    private readonly _configs;
    private readonly _logger;

    constructor({ logger }: TwoFactorHandlerContract) {
        this._configs = require('../../../../tablerise.environment.js') as Configs;
        this._logger = logger;

        this.create = this.create.bind(this);
    }

    public async create(labelAttach: string): Promise<UserTwoFactor> {
        this._logger('info', 'Create - TwoFactorHandler');
        const secret = speakeasy.generateSecret();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${
                this._configs.twoFactorGen.params.label
            } (${labelAttach})`,
            issuer: this._configs.twoFactorGen.params.issuer,
            encoding: this._configs.twoFactorGen.params.encoding as Encoding,
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
            encoding: this._configs.twoFactorGen.params.encoding as Encoding,
            token,
        });

        return valid;
    }
}
