import path from 'path';
import sinon from 'sinon';
import speakeasy from 'speakeasy';
import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import { Logger } from 'src/types/shared/logger';

const configs = require(path.join(__dirname, 'tablerise.environment.js'));

describe('Domains :: Common :: Helpers :: TwoFactorHandler', () => {
    let twoFactorHandler: TwoFactorHandler;

    const logger: Logger = () => {};

    context('#create', () => {
        beforeEach(() => {
            twoFactorHandler = new TwoFactorHandler({ configs, logger });
        });

        it('should return corret object', async () => {
            const result = await twoFactorHandler.create('email');

            expect(result).to.have.property('active');
            expect(result).to.have.property('secret');
            expect(result).to.have.property('qrcode');
        });
    });

    context('#validate', () => {
        const verify = sinon.stub(speakeasy.totp, 'verify').returns(true);

        beforeEach(() => {
            twoFactorHandler = new TwoFactorHandler({ configs, logger });
        });

        it('should return corret object', () => {
            const result = twoFactorHandler.validate({
                secret: 'secret',
                token: 'token',
            });

            expect(verify).to.have.been.called();
            expect(result).to.be.equal(true);
        });
    });
});
