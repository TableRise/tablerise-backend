import sinon from 'sinon';
import GetDisabledRealmsOperation from 'src/core/dungeons&dragons5e/operations/realms/GetDisabledRealmsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledRealmsOperation', () => {
    let getDisabledRealmsOperation: GetDisabledRealmsOperation,
        getDisabledRealmsService: any,
        realms: any;

    const logger = (): void => {};

    context('When disabled realms are recovered with success', () => {
        before(() => {
            realms = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'realms',
            });

            getDisabledRealmsService = {
                getAllDisabled: sinon.spy(() => realms),
            };

            getDisabledRealmsOperation = new GetDisabledRealmsOperation({
                getDisabledRealmsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const realmsTest = await getDisabledRealmsOperation.execute();

            expect(getDisabledRealmsService.getAllDisabled).to.have.been.called();
            expect(realmsTest).to.be.deep.equal(realms);
        });
    });
});
