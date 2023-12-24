import sinon from 'sinon';
import TokenForbidden from 'src/domains/common/helpers/TokenForbidden';

describe('Domains :: Common :: Helpers :: TokenForbidden', () => {
    let tokenForbidden: TokenForbidden, databaseConnect: any;

    const logger = (): void => {};
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyfQ.nrPczPRMFxJXB-2trbUJnQOWbb31LSaiS9BfkXylBIo';

    context('#addToken', () => {
        const spyFuncOne = sinon.spy();
        const spyFuncTwo = sinon.spy();

        before(() => {
            databaseConnect = () => ({
                set: spyFuncOne,
                expireAt: spyFuncTwo,
            });

            tokenForbidden = new TokenForbidden({
                databaseConnect,
                logger,
            });
        });

        it('Should call correct methods with correct params', async () => {
            process.env.JWT_SECRET = '';
            await tokenForbidden.addToken(token);
            expect(spyFuncOne).to.have.been.called();
            expect(spyFuncTwo).to.have.been.called();
        });
    });

    context('#verifyForbiddenToken - no forbidden', () => {
        before(() => {
            const spyFuncOne = sinon.spy(() => 0);

            databaseConnect = () => ({
                exists: spyFuncOne,
            });

            tokenForbidden = new TokenForbidden({
                databaseConnect,
                logger,
            });
        });

        it('Should call correct methods with correct params', async () => {
            process.env.JWT_SECRET = '';
            const isTokenForbiddenTest = await tokenForbidden.verifyForbiddenToken(token);
            expect(databaseConnect().exists).to.have.been.called();
            expect(isTokenForbiddenTest).to.be.equal(false);
        });
    });

    context('#verifyForbiddenToken - forbidden', () => {
        before(() => {
            const spyFuncOne = sinon.spy(() => 1);

            databaseConnect = () => ({
                exists: spyFuncOne,
            });

            tokenForbidden = new TokenForbidden({
                databaseConnect,
                logger,
            });
        });

        it('Should call correct methods with correct params', async () => {
            process.env.JWT_SECRET = '';
            const isTokenForbiddenTest = await tokenForbidden.verifyForbiddenToken(token);
            expect(databaseConnect().exists).to.have.been.called();
            expect(isTokenForbiddenTest).to.be.equal(true);
        });
    });
});
