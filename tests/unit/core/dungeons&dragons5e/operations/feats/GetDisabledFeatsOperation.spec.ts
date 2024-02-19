import sinon from 'sinon';
import GetDisabledFeatsOperation from 'src/core/dungeons&dragons5e/operations/feats/GetDisabledFeatsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledFeatsOperation', () => {
    let getDisabledFeatsOperation: GetDisabledFeatsOperation,
        getDisabledFeatsService: any,
        feats: any;

    const logger = (): void => {};

    context('When disabled feats are recovered with success', () => {
        before(() => {
            feats = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'feats',
            });

            getDisabledFeatsService = {
                getAllDisabled: sinon.spy(() => feats),
            };

            getDisabledFeatsOperation = new GetDisabledFeatsOperation({
                getDisabledFeatsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featsTest = await getDisabledFeatsOperation.execute();

            expect(getDisabledFeatsService.getAllDisabled).to.have.been.called();
            expect(featsTest).to.be.deep.equal(feats);
        });
    });
});
