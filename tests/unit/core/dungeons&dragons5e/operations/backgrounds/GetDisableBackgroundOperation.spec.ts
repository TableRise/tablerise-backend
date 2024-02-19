import sinon from 'sinon';
import GetDisabledBackgroundsOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetDisabledBackgroundsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisableBackgroundOperation', () => {
    let getDisabledBackgroundsOperation: GetDisabledBackgroundsOperation,
        getDisabledBackgroundsService: any,
        background: any;

    const logger = (): void => {};

    context('When disabled backgrounds are recovered with success', () => {
        before(() => {
            background = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'backgrounds',
            });

            getDisabledBackgroundsService = {
                getAllDisabled: sinon.spy(() => [background]),
            };

            getDisabledBackgroundsOperation = new GetDisabledBackgroundsOperation({
                getDisabledBackgroundsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const backgroundTest = await getDisabledBackgroundsOperation.execute();

            expect(getDisabledBackgroundsService.getAllDisabled).to.have.been.called();
            expect(backgroundTest).to.be.deep.equal([background]);
        });
    });
});
