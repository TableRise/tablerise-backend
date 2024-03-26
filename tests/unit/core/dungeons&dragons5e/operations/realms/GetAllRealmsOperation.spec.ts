import sinon from 'sinon';
import GetAllRealmsOperation from 'src/core/dungeons&dragons5e/operations/realms/GetAllRealmsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllRealmsOperation', () => {
    let getAllRacesOperation: GetAllRealmsOperation,
        getAllRealmsService: any,
        realms: any;

    const logger = (): void => {};

    context('When realms are recovered with success', () => {
        before(() => {
            realms = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'realms',
            });

            getAllRealmsService = {
                getAll: sinon.spy(() => realms),
            };

            getAllRacesOperation = new GetAllRealmsOperation({
                getAllRealmsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const realmsTest = await getAllRacesOperation.execute();

            expect(getAllRealmsService.getAll).to.have.been.called();
            expect(realmsTest).to.be.deep.equal(realms);
        });
    });
});
