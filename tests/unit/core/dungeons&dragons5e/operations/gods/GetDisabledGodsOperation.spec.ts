import sinon from 'sinon';
import GetDisabledGodsOperation from 'src/core/dungeons&dragons5e/operations/gods/GetDisabledGodsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledGodsOperation', () => {
    let getDisabledGodsOperation: GetDisabledGodsOperation,
        getDisabledGodsService: any,
        gods: any;

    const logger = (): void => {};

    context('When disabled gods are recovered with success', () => {
        before(() => {
            gods = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'gods',
            });

            getDisabledGodsService = {
                getAllDisabled: sinon.spy(() => gods),
            };

            getDisabledGodsOperation = new GetDisabledGodsOperation({
                getDisabledGodsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const godsTest = await getDisabledGodsOperation.execute();

            expect(getDisabledGodsService.getAllDisabled).to.have.been.called();
            expect(godsTest).to.be.deep.equal(gods);
        });
    });
});
