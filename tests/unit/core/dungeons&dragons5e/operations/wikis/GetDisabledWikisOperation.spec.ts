import sinon from 'sinon';
import GetDisabledWikisOperation from 'src/core/dungeons&dragons5e/operations/wikis/GetDisabledWikisOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledWikisOperation', () => {
    let getDisabledWikisOperation: GetDisabledWikisOperation,
        getDisabledWikisService: any,
        wikis: any;

    const logger = (): void => {};

    context('When disabled wikis are recovered with success', () => {
        before(() => {
            wikis = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'wikis',
            });

            getDisabledWikisService = {
                getAllDisabled: sinon.spy(() => wikis),
            };

            getDisabledWikisOperation = new GetDisabledWikisOperation({
                getDisabledWikisService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const wikisTest = await getDisabledWikisOperation.execute();

            expect(getDisabledWikisService.getAllDisabled).to.have.been.called();
            expect(wikisTest).to.be.deep.equal(wikis);
        });
    });
});
