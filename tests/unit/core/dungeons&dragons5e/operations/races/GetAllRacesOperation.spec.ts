import sinon from 'sinon';
import GetAllRacesOperation from 'src/core/dungeons&dragons5e/operations/races/GetAllRacesOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllRacesOperation', () => {
    let getAllRacesOperation: GetAllRacesOperation, getAllRacesService: any, races: any;

    const logger = (): void => {};

    context('When races are recovered with success', () => {
        before(() => {
            races = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'races',
            });

            getAllRacesService = {
                getAll: sinon.spy(() => races),
            };

            getAllRacesOperation = new GetAllRacesOperation({
                getAllRacesService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const racesTest = await getAllRacesOperation.execute();

            expect(getAllRacesService.getAll).to.have.been.called();
            expect(racesTest).to.be.deep.equal(races);
        });
    });
});
