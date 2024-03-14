import sinon from 'sinon';
import GetDisabledRacesOperation from 'src/core/dungeons&dragons5e/operations/races/GetDisabledRacesOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledRacesOperation', () => {
    let getDisabledRacesOperation: GetDisabledRacesOperation,
        getDisabledRacesService: any,
        races: any;

    const logger = (): void => {};

    context('When disabled races are recovered with success', () => {
        before(() => {
            races = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'races',
            });

            getDisabledRacesService = {
                getAllDisabled: sinon.spy(() => races),
            };

            getDisabledRacesOperation = new GetDisabledRacesOperation({
                getDisabledRacesService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const racesTest = await getDisabledRacesOperation.execute();

            expect(getDisabledRacesService.getAllDisabled).to.have.been.called();
            expect(racesTest).to.be.deep.equal(races);
        });
    });
});
