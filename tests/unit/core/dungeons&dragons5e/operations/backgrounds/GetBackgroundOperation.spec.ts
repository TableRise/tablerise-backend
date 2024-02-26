import sinon from 'sinon';
import GetBackgroundOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetBackgroundOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetBackgroundOperation', () => {
    let getBackgroundOperation: GetBackgroundOperation,
        getBackgroundService: any,
        background: any;

    const logger = (): void => {};

    context('When background is recovered with success', () => {
        before(() => {
            background = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'backgrounds',
            });

            getBackgroundService = {
                get: sinon.spy(() => background),
            };

            getBackgroundOperation = new GetBackgroundOperation({
                getBackgroundService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const backgroundTest = await getBackgroundOperation.execute('123');

            expect(getBackgroundService.get).to.have.been.called();
            expect(backgroundTest).to.be.deep.equal(background);
        });
    });
});
