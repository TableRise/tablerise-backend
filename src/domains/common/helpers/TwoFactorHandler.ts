import speakeasy, { Encoding } from 'speakeasy';
import qrcode from 'qrcode';
import {
    TwoFactorHandlerContract,
    TwoFactorProps,
    TwoFactorValidatePayload,
} from 'src/types/modules/domains/common/helpers/TwoFactorHandler';

export default class TwoFactorHandler {
    private readonly configs;
    private readonly logger;

    constructor({ configs, logger }: TwoFactorHandlerContract) {
        this.configs = configs;
        this.logger = logger;

        this.create = this.create.bind(this);
    }

    public async create(labelAttach: string): Promise<TwoFactorProps> {
        this.logger('info', 'Create - TwoFactorHandler');
        const secret = speakeasy.generateSecret();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${this.configs.twoFactorGen.params.label} (${labelAttach})`,
            issuer: this.configs.twoFactorGen.params.issuer,
            encoding: this.configs.twoFactorGen.params.encoding as Encoding,
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
            encoding: this.configs.twoFactorGen.params.encoding as Encoding,
            token,
        });

        return valid;
    }
}
